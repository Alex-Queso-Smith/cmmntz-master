module Admin
  class ArticlesController < Fae::BaseController

    private

    def build_assets
      @item.build_banner if @item.banner.blank?
    end
  end
end
