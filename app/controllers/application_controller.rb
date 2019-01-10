class ApplicationController < ActionController::Base
  # include ControllerIncludes::CurrentUser # methods regarding current_user

  helper_method :current_user_session, :current_user
  ALL_FILTERS = [:require_app_access, :require_user, :current_user, :current_user_session, :create_guest_unless_logged_in]
  LOG_FILTERS= [:log_activity]
  before_action *ALL_FILTERS, *LOG_FILTERS

  private
  def log_activity
    return unless cookies['cf-super-secure-app-1'] && cookies['cf-super-secure-app-1'] == "a"
    puts "activity.user.action: #{Time.now.utc.strftime("%Y-%m-%d %H:%M")} ,#{cookies['cf-super-betatester-email']}, #{request.remote_ip}, #{params[:controller]},#{params[:action]}}"
  end

  def create_guest_unless_logged_in
    if current_user.nil?
      guest = User.create_guest_account
      guest.reset_persistence_token!
      @current_user_session = UserSession.create(guest)
      @current_user = @current_user_session && @current_user_session.user
    end
  end

  def require_app_access
    unless cookies['cf-super-secure-app-1'] && cookies['cf-super-secure-app-1'] == "a"
      redirect_to authorize_access_url
    end
  end

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
    puts "current_user: #{current_user.inspect}"
    unless current_user
      store_location
      flash[:notice] = "You must be logged in to access this page"
      redirect_to login_url
      return false
    end
  end

  def require_no_user
    if current_user && !current_user.guest?
      store_location
      flash[:notice] = "You must be logged out to access this page"
      redirect_to root_path
      return false
    end
  end
end
