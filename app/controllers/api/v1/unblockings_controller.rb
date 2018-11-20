class Api::V1::UnblockingsController < ApiController
  load_and_authorize_resource :blocking

  # POST /blockings.json
  def create
    @blocking = Blocking.where(blocking_params).first
    if @blocking && can?(:crud, @blocking) &&  @blocking.destroy
      render json: { message: "Blocking Destroyed" }
    else
      render json: { message: "Could not find or destroy matching blocking", status: :unprocessable_entity }
    end
  end

  private
    # Never trust parameters from the scary internwet, only allow the white list through.
    def blocking_params
      params.require(:blocking).permit(:blocker_id, :blocking_id)
    end
end
