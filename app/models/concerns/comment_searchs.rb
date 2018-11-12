module CommentSearchs
  extend ActiveSupport::Concern

  included do
    FILTER_PERCENT = '.2000'
    self.per_page = 10

    scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }
    scope :select_tabulation, -> {
      select_base.select_vote_summation.select_vote_percentiles.select_like_score.joins_votes.group(:id)
    }
    scope :select_base, -> {
      select("comments.*", "CHAR_LENGTH(comments.text) as comment_length")
    }
    scope :select_vote_summation, -> {
      select(
        "sum(case when votes.vote_type  = 'top' then 1 else 0 end) as top_count,
        sum(case when votes.vote_type  = 'love' then 1 else 0 end) as love_count,
        sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end) as like_a_lot_count,
        sum(case when votes.vote_type  = 'like' then 1 else 0 end) as like_count,
        sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end) as indifferent_count,
        sum(case when votes.vote_type  = 'dislike' then 1 else 0 end) as dislike_count,
        sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end) as dislike_a_lot_count,
        sum(case when votes.vote_type  = 'trash' then 1 else 0 end) as trash_count,
        sum(case when votes.vote_type  = 'warn' then 1 else 0 end) as warn_count,
        sum(case when votes.vote_type  = 'smart' then 1 else 0 end) as smart_count,
        sum(case when votes.vote_type  = 'funny' then 1 else 0 end) as funny_count,
        sum(case when votes.vote_type  = 'happy' then 1 else 0 end) as happy_count,
        sum(case when votes.vote_type  = 'shocked' then 1 else 0 end) as shocked_count,
        sum(case when votes.vote_type  = 'sad' then 1 else 0 end) as sad_count,
        sum(case when votes.vote_type  = 'boring' then 1 else 0 end) as boring_count,
        sum(case when votes.vote_type  = 'angry' then 1 else 0 end) as angry_count"
      )
    }

    scope :select_vote_percentiles, -> {
      select(
        "(case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'top' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as top_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'love' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as love_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as like_a_lot_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'like' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as like_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as indifferent_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'dislike' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as dislike_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as dislike_a_lot_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'trash' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as trash_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'warn' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as warn_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'smart' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as smart_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'funny' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as funny_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'happy' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as happy_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'shocked' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as shocked_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'sad' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as sad_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'boring' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as boring_percent,
        (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'angry' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end)::DECIMAL(5,4) as angry_percent"
      )
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
    scope :not_replies, -> {
      where(parent_id: nil)
    }

    scope :comments_from_followed, lambda { |user_ids|
      where(comments: {user_id: user_ids})
    }

    scope :not_anon, -> { where(comments: {anonymous: false}) }

    def self.filter_and_sort(user, article_id, article_type, filter_opts = {}, page)
      scope = select_tabulation.for_art_type_and_id(article_type, article_id).includes(:user, replies: [:user])

      if filter_opts[:filter_list]
        filter_opts[:filter_list].split(",").each do |item|
          scope = scope.where(arel_table[item].send(:gteq, FILTER_PERCENT))
        end
      end

      # filter not list

      # filter user info

      # geo
      # convert users geo locations to radians (deg * (Math::PI / 180))
      # lat_rad = user.latitude * (Math::PI / 180)
      # lon_rad = user.longitude * (Math::PI / 180)
      # use basic bounding and law of cosines
      # see https://www.movable-type.co.uk/scripts/latlong-db.html


      dir = filter_opts[:sort_dir] ? filter_opts[:sort_dir] : "desc"
      sort_type = filter_opts[:sort_type] ? filter_opts[:sort_type] : "created_at"

      # if user && user.followed_users
      #   scope = scope.where(votes: {user_id: user.followed_user_ids})
      #   # scope = scope.merge(Vote.where(user_id: user.followed_user_ids))
      # end

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

      # do not include replies
      scope = scope.not_replies
      # scope = scope.order(sort_type.to_sym => dir.to_sym)
      scope = scope.order("#{sort_type} #{dir}")
      scope = scope.page(page)
      return scope
    end
  end
end
