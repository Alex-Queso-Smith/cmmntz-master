module Admin
  class ArticlesController < Fae::BaseController

    private

    def build_assets
      @item.build_banner if @item.banner.blank?
      @item.build_thumbnail if @item.thumbnail.blank?
      @item.build_top_image if @item.top_image.blank?
      @item.build_middle_image if @item.middle_image.blank?
      @item.build_footer_image if @item.footer_image.blank?
    end
  end
end
