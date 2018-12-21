class Api::V1::GalleryBlacklistingsController < ApiController
  load_and_authorize_resource

  def create
    get_user
    gallery = Gallery.find(params[:gallery_id])
    dur = params[:dur] || ""
    gallery.gallery_blacklistings.create(user: @user, dur: dur) if admin?
    render json: { message: "Success" }
  end

  private

  def get_user
    @user = User.find(params[:user_id])
  end

  def admin?
    current_user.customer_for?(params[:gallery_id])
  end

end
