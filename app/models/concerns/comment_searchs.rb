module CommentSearchs
  extend ActiveSupport::Concern

  included do
    self.per_page = 10

    scope :for_art_type_and_id, lambda { |type, id| where(art_type: type, art_id: id ) }

    def self.filter_and_sort(article_id, article_type, filter_opts = {}, page)
      scope = for_art_type_and_id(article_type, article_id).includes(:user)
      dir = filter_opts[:sort_dir] ? filter_opts[:sort_dir] : "desc"
      sort_type = filter_opts[:sort_type] ? filter_opts[:sort_type] : "created_at"
      scope = scope.order(sort_type.to_sym => dir.to_sym)
      scope = scope.page(page)
      return scope
    end
  end
end
