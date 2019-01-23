class Api::V1::HeatmapsController < ApiController
  def index
    comments = Comment.complete_listing_for_thread_heatmap(params[:art_id], current_user)
    @users = comments.map(&:user).flatten.reject{ |u| u.blank? || u.latitude.blank? || u.longitude.blank? }
  end
end
