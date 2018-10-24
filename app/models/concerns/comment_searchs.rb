module CommentSearchs
  extend ActiveSupport::Concern

  included do
    self.per_page = 10

    def self.filter_and_sort(article_id, article_type, filter_opts = {}, page)
      scope = for_art_type_and_id(article_type, article_id).includes(:user)
      if filter_opts[:sort_order] && filter_opts[:sort_order] == "asc"
        scope = scope.order("comments.created_at asc")
      else
        scope = scope.order("comments.created_at desc")
      end
      scope = scope.page(page)
      return scope
    end
  end
end
