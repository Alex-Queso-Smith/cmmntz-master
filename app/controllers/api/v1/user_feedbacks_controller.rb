class Api::V1::UserFeedbacksController < ApiController
  load_and_authorize_resource


  # POST /user_feedbacks.json
  def create
    @user_feedback = UserFeedback.new(user_feedback_params)

    if @user_feedback.save
      render json: {message: "Thank You for your feedback!"}
    else
      render json: { errors: @user_feedback.errors, status: :unprocessable_entity }
    end
  end

  private

  def user_feedback_params
    params.require(:user_feedback).permit(:user_id, :type, :category, :text)
  end
end
