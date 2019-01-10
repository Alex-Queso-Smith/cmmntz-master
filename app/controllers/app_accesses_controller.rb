class AppAccessesController < ApplicationController
  skip_before_action *ALL_FILTERS

  def new
    @app_access = AppAccess.new
  end

  def create
    @app_access = AppAccess.new(app_access_params)
    if @app_access.valid?
      # set cookie
      expiration = Time.now + 1.year
      cookies['cf-super-secure-app-1'] = {value: "a", expires: expiration}
      cookies['cf-super-betatester-email'] = {value: @app_access.email, expires: expiration}
      flash[:notice] = "Login successful!"

      output_log_stream("activity.user.app_access", @app_access.email, "status: successful")
      redirect_to root_url
    else
      output_log_stream("activity.user.app_access", @app_access.email, "status: failed, errors: #{@app_access.errors.full_messages}")
      render :action => :new
    end
  end

  def destroy
    cookies.delete('cf-super-secure-app-1')
    cookies.delete('cf-super-betatester-email')
    output_log_stream("activity.user.app_access", cookies['cf-super-betatester-email'], "status: deauthorized")
    redirect_to root_url
  end

  private

  def app_access_params
    params.require(:app_access).permit(:email, :password)
  end
end
