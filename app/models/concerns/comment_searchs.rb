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

    # sort and filter for art listings
    def self.filter_and_sort(user, article_id, article_type, filter_opts = {}, comment_ids = [], page)
      scope = select_tabulation.for_art_type_and_id(article_type, article_id).includes(:user)

      if filter_opts[:filter_list]
        filter_opts[:filter_list].split(",").each do |item|
          scope = scope.send("having_#{item}_gteq", FILTER_PERCENT)
        end
      end

      # filter not list
      if filter_opts[:not_filter_list]
        filter_opts[:not_filter_list].split(",").each do |item|
          scope = scope.send("having_#{item}_lt", FILTER_PERCENT)
        end
      end

      # filter user info

      # geo
      # convert users geo locations to radians (deg * (Math::PI / 180))
      # lat_rad = user.latitude * (Math::PI / 180)
      # lon_rad = user.longitude * (Math::PI / 180)
      # use basic bounding and law of cosines
      # see https://www.movable-type.co.uk/scripts/latlong-db.html


      dir = filter_opts[:sort_dir] ? filter_opts[:sort_dir] : "desc"
      sort_type = filter_opts[:sort_type] ? filter_opts[:sort_type] : "created_at"

      # narrow scope of votes
      if user && user.followed_users && filter_opts[:votes_from]
        if filter_opts[:votes_from] == "friends"
          user_ids = user.followed_user_ids
        elsif filter_opts[:votes_from] == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.joins_votes_with_user_list(user_ids.map{|id| "'#{id}'"}.join(", "))
      else
        scope = scope.joins_votes
      end

      if user && user.followed_users && filter_opts[:comments_from]
        if filter_opts[:comments_from] == "friends"
          user_ids = user.followed_user_ids
        elsif filter_opts[:comments_from] == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.comments_from_followed(user_ids).not_anon
      end

      # remove blacklisted users from consideration
      if user && user.blocked_users
        scope = scope.where(arel_table[:user_id].send(:not_in, user.blocked_user_ids))
      end

      if filter_opts[:comment_id] # individual comment
        scope = scope.where(id: filter_opts[:comment_id])
      elsif comment_ids.present? # specific list of comments
        scope = scope.where(parent_id: comment_ids)
      else # full list
        scope = scope.not_replies.page(page)
      end

      # do not include replies
      # scope = scope.order(sort_type.to_sym => dir.to_sym)
      scope = scope.order("#{sort_type} #{dir}")
      # scope = scope.page(page)
      return scope
    end

    # sort and filter for given list of comments
    def self.tabulation_for_comments_list(user, article_id, article_type, filter_opts = {}, comment_ids = [], page)
      scope = select_tabulation.for_art_type_and_id(article_type, article_id).includes(:user)

      if filter_opts[:filter_list]
        filter_opts[:filter_list].split(",").each do |item|
          scope = scope.send("having_#{item}_gteq", FILTER_PERCENT)
        end
      end

      # filter not list
      if filter_opts[:not_filter_list]
        filter_opts[:not_filter_list].split(",").each do |item|
          scope = scope.send("having_#{item}_lt", FILTER_PERCENT)
        end
      end

      # filter user info

      # geo
      # convert users geo locations to radians (deg * (Math::PI / 180))
      # lat_rad = user.latitude * (Math::PI / 180)
      # lon_rad = user.longitude * (Math::PI / 180)
      # use basic bounding and law of cosines
      # see https://www.movable-type.co.uk/scripts/latlong-db.html


      dir = filter_opts[:sort_dir] ? filter_opts[:sort_dir] : "desc"
      sort_type = filter_opts[:sort_type] ? filter_opts[:sort_type] : "created_at"

      # narrow scope of votes
      if user && user.followed_users && filter_opts[:votes_from]
        if filter_opts[:votes_from] == "friends"
          user_ids = user.followed_user_ids
        elsif filter_opts[:votes_from] == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.joins_votes_with_user_list(user_ids.map{|id| "'#{id}'"}.join(", "))
      else
        scope = scope.joins_votes
      end

      if user && user.followed_users && filter_opts[:comments_from]
        if filter_opts[:comments_from] == "friends"
          user_ids = user.followed_user_ids
        elsif filter_opts[:comments_from] == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.comments_from_followed(user_ids).not_anon
      end

      # remove blacklisted users from consideration
      if user && user.blocked_users
        scope = scope.where(arel_table[:user_id].send(:not_in, user.blocked_user_ids))
      end

      if filter_opts[:comment_id] # individual comment
        scope = scope.where(id: filter_opts[:comment_id])
      elsif comment_ids.present? # specific list of comments
        scope = scope.where(parent_id: comment_ids)
      else # full list
        scope = scope.not_replies.page(page)
      end

      # do not include replies
      # scope = scope.order(sort_type.to_sym => dir.to_sym)
      scope = scope.order("#{sort_type} #{dir}")
      # scope = scope.page(page)
      return scope
    end

    # retrieve tabulation for single comment
    def self.tabulation_for_individual_comment(user, comment_id, filter_opts = {})
      scope = where(id: comment_id).select_tabulation.includes(:user)

      # narrow scope of votes
      if user && user.followed_users && filter_opts[:votes_from]
        if filter_opts[:votes_from] == "friends"
          user_ids = user.followed_user_ids
        elsif filter_opts[:votes_from] == "network"
          user_ids = user.network_user_ids
        end
        scope = scope.joins_votes_with_user_list(user_ids.map{|id| "'#{id}'"}.join(", "))
      else
        scope = scope.joins_votes
      end

      return scope.first
    end
  end
end
