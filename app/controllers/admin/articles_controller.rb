module Admin
  class ArticlesController < Fae::BaseController

    private

    def build_assets
      @item.build_banner if @item.banner.blank?
      @item.build_thumbnail if @item.thumbnail.blank?
      @item.build_middle_image if @item.middle_image.blank?
    end
  end
end
