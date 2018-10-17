class Api::V1::UserSessionsController < ApiController
  skip_before_action *ALL_FILTERS, only: [:new, :create]
  before_action :require_no_user, only: [:new, :create]

  def new
    redirect_to(root_path) and return if current_user
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      render json: { message: "Logged in successfully" }
    else
      render json: @user_session.errors, status: :unprocessable_entity
    end
  end

  def destroy
    current_user_session.destroy
    render json: { message: "Logged out successfully" }
  end
end
