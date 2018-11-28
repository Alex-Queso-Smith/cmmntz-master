class Api::V1::ArtsController < ApiController
  def show
    @art = Art.find(params[:id])
  end
end
