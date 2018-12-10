class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  # GET /articles
  # GET /articles.json
  def index
    page = params[:page] || 1
    @articles = Article.order(publish_date: :desc).where("publish_date <= '#{Date.today}'").page(page)
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
    url = @article.url(request)
    @art = Art.where(url: url).first_or_create do |art|
      art.gallery = Gallery.find_by(name: "Classibridge Times")
      art.topics_list = @article.topics
      art.published_at = @article.publish_date
      art.art_type = "article"
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find_by(slug: params[:slug])
    end
end
