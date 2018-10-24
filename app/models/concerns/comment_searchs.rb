module CommentSearch
  extend ActiveSupport::Concern

  included do
    self.per_page = 30
  end

  class << self
    def filter_and_sort(article_id, article_type, filter_opts = {}, sort_opts ={})
      scope = for_art_type_and_id(article_type, article_id).includes(:user)
      if sort_opts[:dir] && sort_opts[:dir] == "asc"
        scope = scope.order("comments.created_at asc")
      else
        scope = scope.order("comments.created_at desc")
      end

      return scope
    end
  end
end
