class ApplicationController < ActionController::Base
  # include ControllerIncludes::CurrentUser # methods regarding current_user

  helper_method :current_user_session, :current_user, :output_log_stream
  ALL_FILTERS = [:require_app_access, :require_user, :current_user, :current_user_session, :create_guest_unless_logged_in]
  BEFORE_LOG_FILTERS= [:before_log_activity]
  AFTER_LOG_FILTERS= [:after_log_activity]
  before_action *ALL_FILTERS, *BEFORE_LOG_FILTERS
  after_action *AFTER_LOG_FILTERS



  private
  def before_log_activity
    return unless cookies['cf-super-secure-app-1'] && cookies['cf-super-secure-app-1'] == "a"

    email = cookies['cf-super-betatester-email']
    output_log_stream("activity.user.action", email, "params: #{params}")
  end

  def after_log_activity
    return unless cookies['cf-super-secure-app-1'] && cookies['cf-super-secure-app-1'] == "a"
    # raise "#{response.inspect}"
    email = cookies['cf-super-betatester-email']
    xtra = ""
    if request.format == "application/json"
      xtra = "response_body: #{response.body}"
    end

    output_log_stream("activity.system.response", email, xtra)
  end

  def output_log_stream(log_type, email, extra_stuff = "")
    if !extra_stuff.blank?
      extra_stuff = ", " + extra_stuff
    end
    user_id = !current_user.blank? ? "n/a" : current_user.id
    puts "logging.#{log_type}: #{Time.now.utc.strftime("%Y-%m-%d %H:%M:%S")}, email: #{email}, user_id: #{user_id}, ip: #{request.remote_ip}, controller: #{params[:controller]}, action: #{params[:action]}, object_id: #{params[:id]}, ua_string: #{request.user_agent}, request_type: #{request.format}#{extra_stuff}"
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

  rescue_from CanCan::AccessDenied do |exception|
    output_log_stream("action.user.access", cookies['cf-super-betatester-email'], "status: not_authorized")
    respond_to do |format|
      format.json { head :forbidden }
      format.html { render :file => "#{Rails.root}/public/403.html", :status => 403, :layout => false }
    end
  end if Rails.env.production?

  rescue_from ActiveRecord::RecordNotFound do |exception|
    output_log_stream("action.user.access", cookies['cf-super-betatester-email'], "status: resource_does_not_exist")
    respond_to do |format|
      format.json { head :not_found }
      format.html { render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false }
    end
  end if Rails.env.production?

  rescue_from Exception do |exception|
    output_log_stream("action.user.access", cookies['cf-super-betatester-email'], "exception: #{exception.inspect}")
    respond_to do |format|
      format.json { head :status => 500 }
      format.html { render :file => "#{Rails.root}/public/500.html", :status => 500, :layout => false }
    end
  end if Rails.env.production?
end
