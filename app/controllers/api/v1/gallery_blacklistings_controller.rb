class Api::V1::GalleryBlacklistingsController < ApiController
  load_and_authorize_resource

  def create
    get_user
    current_gallery.blacklisted_users << @user if admin?
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
