class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  # GET /articles
  # GET /articles.json
  def index
    @articles = Article.all
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
    url = @article.url(request)
    @art = Art.where(url: url).first_or_create do |art|
      art.gallery = Gallery.find_by(name: "Classibridge Times")
      # art.set_topics = @article.topics
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find_by_slug(params[:slug])
    end
end
