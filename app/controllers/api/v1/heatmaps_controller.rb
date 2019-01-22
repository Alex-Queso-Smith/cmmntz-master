class Api::V1::HeatmapsController < ApiController
  def index
    comments = Comment.complete_listing_for_thread_heatmap(params[:art_id])
    @users = comments.map(&:user).flatten.uniq.reject{ |u| u.blank? }
  end
end
