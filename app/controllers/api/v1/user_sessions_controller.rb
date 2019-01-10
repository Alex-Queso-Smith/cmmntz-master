class Api::V1::UserSessionsController < ApiController
  skip_before_action *ALL_FILTERS - [:require_app_access], only: [:new, :create]
  before_action :require_no_user, only: [:new, :create]

  def new
    redirect_to(root_path) and return if current_user
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(user_session_params.to_h)

    if @user_session.valid?
      cu_hold = current_user
      current_user_session.destroy
      cu_hold.destroy
    end

    if @user_session.save
      output_log_stream("activity.user.login", cookies['cf-super-betatester-email'], "status: successful")
      render json: { message: "Logged in successfully" }
    else
      output_log_stream("activity.user.login", cookies['cf-super-betatester-email'], "status: failure")
      render json: { errors: @user_session.errors, status: :unprocessable_entity }
    end
  end

  def destroy
    current_user_session.destroy
    output_log_stream("activity.user.logout", cookies['cf-super-betatester-email'])
    render json: { message: "Logged out successfully" }
  end

  private

  def user_session_params
    params.require(:user_session).permit(:user_name, :password, :remember_me)
  end
end
