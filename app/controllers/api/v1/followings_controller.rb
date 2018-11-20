class Api::V1::FollowingsController < ApiController
  load_and_authorize_resource

  # POST /followings.json
  def create
    @following = Following.new(following_params)
    if @following.save
      render json: { message: "Following Created" }
    else
      render json: { errors: @following.errors.full_messages, status: :unprocessable_entity }
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def following_params
      params.require(:following).permit(:follower_id, :following_id)
    end
end
