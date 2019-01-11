class Api::V1::UserFeedbacksController < ApiController
  load_and_authorize_resource


  # POST /user_feedbacks.json
  def create
    @user_feedback = UserFeedback.new(user_feedback_params)

    user_agent = UserAgent.parse(request.user_agent)
    @user_feedback.browser= user_agent.browser
    @user_feedback.browser_version= user_agent.version
    @user_feedback.platform= user_agent.platform
    @user_feedback.os= user_agent.os
    @user_feedback.ip= request.remote_ip
    @user_feedback.email= current_user.guest? ? cookies['cf-super-betatester-email'] : current_user.email

    if @user_feedback.save
      render json: { message: "Thank You for your feedback!" }
    else
      render json: { errors: @user_feedback.errors, status: :unprocessable_entity }
    end
  end

  private

  def user_feedback_params
    params.require(:user_feedback).permit(:user_id, :type, :category, :text, :first_name, :last_name)
  end
end
