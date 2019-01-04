class ArticlesController < ApplicationController
  skip_before_action *ALL_FILTERS - [:require_app_access, :create_guest_unless_logged_in]
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
    @art = Art.find_or_create_for_url(url, "Customer Newspaper Site-Test", @article.topics, @article.publish_date, @article.author.name, "article")
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find_by(slug: params[:slug])
    end
end
