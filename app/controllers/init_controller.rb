class InitController < ApplicationController
  protect_from_forgery unless: -> { true }
  before_action :set_header, :safari_cookie_fix

  def index
    render html: ''
  end

  private
  def set_header
    response.set_header('X-Frame-Options', 'CMMNTZ')
  end

  def safari_cookie_fix
    user_agent = UserAgent.parse(request.user_agent) # Uses useragent gem!
    if user_agent.browser == 'Safari' # we apply the fix..
      return if session[:safari_cookie_fixed] # it is already fixed.. continue
      if params[:safari_cookie_fix].present? # we should be top window and able to set cookies.. so fix the issue :)
        session[:safari_cookie_fixed] = true
        redirect_to params[:redir]
      else
        # Redirect the top frame to your server..
        render :html => "<script>top.window.location='?safari_cookie_fix=true&redir=#{url_encode(params[:redir])}';</script>".html_safe
      end
    end
  end
end
