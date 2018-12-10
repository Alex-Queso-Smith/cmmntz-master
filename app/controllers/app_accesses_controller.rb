class AppAccessesController < ApplicationController
  skip_before_action *ALL_FILTERS

  def new
    @app_access = AppAccess.new
  end

  def create
    @app_access = AppAccess.new(app_access_params)
    if @app_access.valid?
      flash[:notice] = "Login successful!"
      redirect_to root_url
    else
      render :action => :new
    end
  end

  private

  def app_access_params
    params.require(:app_access).permit(:password)
  end
end
