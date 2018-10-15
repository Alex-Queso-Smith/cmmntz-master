class ApplicationController < ActionController::Base
  # include ControllerIncludes::CurrentUser # methods regarding current_user

  helper_method :current_user_session, :current_user
  ALL_FILTERS = [:require_user, :current_user, :current_user_session]
  before_action *ALL_FILTERS

  private

  def store_location
    session[:return_to] = request[:REQUEST_URI]
  end

  def current_user_session
    logger.debug "ApplicationController::current_user_session"
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end

  def current_user
    logger.debug "ApplicationController::current_user"
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end

  def require_user
    unless current_user
      store_location
      flash[:notice] = "You must be logged in to access this page"
      redirect_to login_url
      return false
    end
  end

  def require_no_user
    if current_user
      store_location
      flash[:notice] = "You must be logged out to access this page"
      redirect_to root_path
      return false
    end
  end
end
