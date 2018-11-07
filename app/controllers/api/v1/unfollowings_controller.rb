class Api::V1::UnfollowingsController < ApiController
  load_and_authorize_resource :following

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
    # Never trust parameters from the scary internwet, only allow the white list through.
    def following_params
      params.require(:following).permit(:follower_id, :following_id)
    end
end
