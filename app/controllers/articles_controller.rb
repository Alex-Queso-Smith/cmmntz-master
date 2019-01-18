class ArticlesController < ApplicationController
  skip_before_action *ALL_FILTERS - [:require_app_access, :create_guest_unless_logged_in]
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  # GET /articles
  # GET /articles.json
  def index
    page = params[:page] || 1
    @articles = Article.order(publish_date: :desc).where("publish_date <= '#{Date.today}'").page(page).to_a
    @first_article = @articles.shift
    @second_article = @articles.shift
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
    UserArticleView.create_for_user_and_article(current_user.id, @article.id)

    url = @article.url(request)
    @art = Art.find_or_create_for_url(url, "Customer Newspaper Site-Test", @article.topics, @article.publish_date, @article.author.name, "article")
    output_log_stream("activity.user.art_view", "art: #{@art.url}")
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      @article = Article.find_by(slug: params[:slug])
    end
end
