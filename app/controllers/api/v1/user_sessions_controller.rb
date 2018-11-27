class Api::V1::UserSessionsController < ApiController
  skip_before_action *ALL_FILTERS, only: [:new, :create]
  before_action :require_no_user, only: [:new, :create]

  def new
    redirect_to(root_path) and return if current_user
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(user_session_params.to_h)
    if @user_session.save
      puts "login good~~~~~~~~~~~~~"
      render json: { message: "Logged in successfully" }
    else
      puts "login BADDDDDD~~~~~~~~~~~~~#{@user_session.errors.full_messages}"
      render json: { errors: @user_session.errors, status: :unprocessable_entity }
    end
  end

  def destroy
    current_user_session.destroy
    render json: { message: "Logged out successfully" }
  end

  private

  def user_session_params
    params.require(:user_session).permit(:user_name, :password, :remember_me)
  end
end
