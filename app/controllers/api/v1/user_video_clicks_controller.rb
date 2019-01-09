class Api::V1::UserVideoClicksController < ApiController
  load_and_authorize_resource

  # POST /api/v1/user_video_clicks.json
  def create
    @user_video_click = UserVideoClick.find_or_create_by(user_id: current_user.id, video_title: user_video_click_params[:video_title])
    if !@user_video_click.id.blank?
      render json: { message: "Record Created" }
    else
      render json: { errors: @user_video_click.errors.full_messages, status: :unprocessable_entity }
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_video_click_params
      params.require(:user_video_click).permit(:video_title)
    end
end
