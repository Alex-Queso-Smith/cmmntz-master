module CommentSearchs
  extend ActiveSupport::Concern

  included do
    FILTER_PERCENT = '.2000'
    self.per_page = 10

    scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }

    def self.filter_and_sort(user, article_id, article_type, filter_opts = {}, page)
      scope = for_art_type_and_id(article_type, article_id).includes(:user, replies: [:user])

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

      # remove blacklisted users from consideration
      if user && user.blocked_users.present?
        scope = scope.where(arel_table[:user_id].send(:not_in, user.blocked_user_ids))
      end

      scope = scope.order(sort_type.to_sym => dir.to_sym)
      scope = scope.page(page)
      return scope
    end
  end
end
