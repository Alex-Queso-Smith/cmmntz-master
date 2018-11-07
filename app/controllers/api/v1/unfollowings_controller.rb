class Api::V1::UnfollowingsController < ApiController
  load_and_authorize_resource :following

  before_action :set_following, only: [:update, :destroy]

  # POST /followings.json
  def create
    @following = Following.where(following_params).first
    if @following && can?(:crud, @following) &&  @following.destroy
      render json: { message: "Following Destroyed" }
    else
      render json: { message: "Could not find or destroy matching following", status: :unprocessable_entity }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_following
      @following = Following.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def following_params
      params.require(:unfollowing).permit(:follower_id, :following_id)
    end
end
