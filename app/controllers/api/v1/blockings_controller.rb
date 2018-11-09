class Api::V1::BlockingsController < ApiController
  load_and_authorize_resource

  before_action :set_following, only: [:update, :destroy]

  # POST /followings.json
  def create
    @blocking = Blocking.new(blocking_params)
    if @blocking.save
      render json: { message: "Blocking Created" }
    else
      render json: { errors: @blocking.errors.full_messages, status: :unprocessable_entity }
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def blocking_params
      params.require(:blocking).permit(:blocker_id, :blocking_id)
    end
end
