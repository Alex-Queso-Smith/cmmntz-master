class UserSessionsController < ApplicationController
  skip_before_action *ALL_FILTERS - [:require_app_access, :create_guest_unless_logged_in], only: [:new, :create]
  before_action :require_no_user, only: [:new, :create]

  def new
    redirect_to(root_path) and return if current_user && !current_user.guest?
    @user_session = UserSession.new
  end

  def create
    @user_session = UserSession.new(user_session_params)
    raise "#{@user_session.valid?}"
    if @user_session.save
      flash[:notice] = "Login successful!"
      redirect_to root_url
    else
      render :action => :new
    end
  end

  def destroy
    current_user_session.destroy
    flash[:notice] = "Logout successful!"
    redirect_to root_url
  end

  private

  def user_session_params
    params.require(:user_session).permit(:user_name, :password)
  end
end
