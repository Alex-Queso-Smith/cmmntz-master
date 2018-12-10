class AppAccessesController < ApplicationController
  skip_before_action *ALL_FILTERS

  def new
    @app_access = AppAccess.new
  end

  def create
    @app_access = AppAccess.new(app_access_params)
    raise "Code: #{app_passcode} \n\n#{@app_access.inspect}"
  end

  private

  def app_access_params
    params.require(:app_access).permit(:password)
  end
end
