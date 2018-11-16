module CommentSearchs
  extend ActiveSupport::Concern

  included do
    FILTER_PERCENT = '.2000'
    self.per_page = 10

    scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }
    scope :select_tabulation, -> {
      select_base.select_vote_summation.select_vote_percentiles.select_like_score.group(:id)
    }
    scope :select_base, -> {
      select("comments.*", "CHAR_LENGTH(comments.text) as comment_length")
    }

    scope :select_like_score, -> {
      select(
        "(case when comments.interactions_count > 0
          then
            (
              (sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end)::DECIMAL * 2) +
              (sum(case when votes.vote_type  = 'like' then 1 else 0 end)::DECIMAL * 1) +
              (sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end)::DECIMAL * 0) -
              (sum(case when votes.vote_type  = 'dislike' then 1 else 0 end)::DECIMAL * .5) -
              (sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end)::DECIMAL * 1)
          ) / (2 * comments.interactions_count)
          else 0
        end)::DECIMAL(5,4) as like_score"
      )
    }

    scope :joins_votes, -> {
      joins("left join votes on votes.comment_id = comments.id")
    }
    scope :joins_votes_with_user_list, lambda { |user_ids|
      joins("left join votes on votes.comment_id = comments.id and votes.user_id in (#{user_ids})")
    }

    scope :not_replies, -> {
      where(parent_id: nil)
    }

    scope :comments_from_followed, lambda { |user_ids|
      where(comments: {user_id: user_ids})
    }

    scope :not_anon, -> { where(comments: {anonymous: false}) }

    scope :created_since, -> (datetime) {
      where(arel_table[:created_at].gteq(datetime))
    }

    # Meta Scoping

    Vote::TYPES.each do |type|
      scope "having_#{type}_percent_gteq", ->(value) {
        having("(case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = '#{type}' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) >= '#{value}'")
      }

      scope "having_#{type}_percent_lt", ->(value) {
        having("(case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = '#{type}' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) < '#{value}'")
      }

      scope "select_#{type}_count", -> {
        select("sum(case when votes.vote_type  = '#{type}' then 1 else 0 end) as #{type}_count")
      }

      scope "select_#{type}_percent", -> {
        select("(case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = '#{type}' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as #{type}_percent")
      }
    end

    scope :select_vote_summation, -> {
      select_top_count.select_love_count.select_like_a_lot_count.select_like_count.select_indifferent_count.select_dislike_count.select_dislike_a_lot_count.select_trash_count.select_warn_count.select_smart_count.select_funny_count.select_happy_count.select_shocked_count.select_sad_count.select_boring_count.select_angry_count
    }

    scope :select_vote_percentiles, -> {
      select_top_percent.select_love_percent.select_like_a_lot_percent.select_like_percent.select_indifferent_percent.select_dislike_percent.select_dislike_a_lot_percent.select_trash_percent.select_warn_percent.select_smart_percent.select_funny_percent.select_happy_percent.select_shocked_percent.select_sad_percent.select_boring_percent.select_angry_percent
    }

    def self.filter_by_list(scope, filter_list)
      filter_list.split(",").each do |item|
        scope = scope.send("having_#{item}_gteq", FILTER_PERCENT)
      end
      scope
    end

    def self.filter_by_not_list(scope, not_filter_list)
      not_filter_list.split(",").each do |item|
        scope = scope.send("having_#{item}_lt", FILTER_PERCENT)
      end
      scope
    end

    def self.geo_filtering(scope, some_data)
      # convert users geo locations to radians (deg * (Math::PI / 180))
      # lat_rad = user.latitude * (Math::PI / 180)
      # lon_rad = user.longitude * (Math::PI / 180)
      # use basic bounding and law of cosines
      # see https://www.movable-type.co.uk/scripts/latlong-db.html
      scope
    end

    def self.vote_scoping(scope, user, votes_from = "")
      if user && user.followed_users && votes_from
        if votes_from == "friends"
          user_ids = user.followed_user_ids
        elsif votes_from == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.joins_votes_with_user_list(user_ids.map{|id| "'#{id}'"}.join(", "))
      else
        scope = scope.joins_votes
      end

      scope
    end

    def self.get_comments_from(scope, user, comments_from = "")
      if user && user.followed_users && comments_from
        if comments_from == "friends"
          user_ids = user.followed_user_ids
        elsif comments_from == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.comments_from_followed(user_ids).not_anon
      end

      scope
    end

    def self.eliminate_blocked(scope, user)
      if user && user.blocked_users
        scope = scope.where(arel_table[:user_id].send(:not_in, user.blocked_user_ids))
      end

      scope
    end

    def self.sort_list(scope, sort_dir, sort_type)
      sort_dir = sort_dir ? sort_dir : "desc"
      sort_type = sort_type ? sort_type : "created_at"
      scope = scope.order("#{sort_type} #{sort_dir}")
      scope
    end

    def self.base_search(scope, user, filter_opts = {})
      scope = scope.select_tabulation.includes(:user)
      scope = self.filter_by_list(scope, filter_opts[:filter_list]) if filter_opts[:filter_list]
      scope = self.filter_by_not_list(scope, filter_opts[:not_filter_list]) if filter_opts[:not_filter_list]
      scope = self.geo_filtering(scope, filter_opts[:some_data]) if filter_opts[:some_data]
      scope = self.vote_scoping(scope, user, filter_opts[:votes_from])
      scope = self.get_comments_from(scope, user, filter_opts[:comments_from])
      scope = self.eliminate_blocked(scope, user)
      scope = self.sort_list(scope, filter_opts[:sort_dir], filter_opts[:sort_type])
    end

    # sort and filter for art listings
    def self.filter_and_sort(user, article_id, article_type, filter_opts = {}, page)
      scope = for_art_type_and_id(article_type, article_id)
      scope = self.base_search(scope, user, filter_opts)
      scope = scope.not_replies.page(page)
    end

    # sort and filter for given list of comments
    def self.tabulation_for_comments_list(user, comment_ids, filter_opts = {})
      scope = where(parent_id: comment_ids)
      scope = self.base_search(scope, user, filter_opts)
    end

    # retrieve tabulation for single comment
    def self.tabulation_for_individual_comment(user, comment_id, filter_opts = {})
      scope = where(id: comment_id).select_tabulation.includes(:user)

      # narrow scope of votes
      scope = self.vote_scoping(scope, user, filter_opts[:votes_from]).first
    end

    def self.threads_with_activity_since_for_user(user_id, datetime)
      scope = where(user_id: user_id).select(:art_id, :art_type).group(:art_id, :art_type)
      scope= scope.joins("join comments other_comments on comments.art_id = other_comments.art_id AND comments.art_type = other_comments.art_type AND comments.user_id != other_comments.user_id AND other_comments.created_at >= '#{datetime}' ")
      scope
    end

    def self.quality_comments_for_thread_since_for_user(art_id, art_type, user, datetime)
      user_settings = user.quality_comment_settings.map {|k,v| "(case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = '#{k}' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) >= '#{v}'"}
      user_settings = user_settings.join(" OR ")
      scope = for_art_type_and_id(art_type, art_id).where.not(user_id: user.id).created_since(datetime)
      scope = scope.joins_votes
      scope = scope.having(user_settings).group(:id)
      scope
    end
    
    def self.for_thread_since(thread, last_check)
      for_art_type_and_id('art', thread.id).created_since(last_check)
    end
  end

end
