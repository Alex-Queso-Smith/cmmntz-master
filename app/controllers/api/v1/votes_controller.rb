class Api::V1::VotesController < ApiController
  load_and_authorize_resource

  before_action :set_vote, only: [:update, :destroy]

  # POST /votes.json
  def create
    @vote = Vote.new(vote_params)

    if @vote.save
      render json: { message: "Created successfully" }
    else
      render json: { errors: @vote.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /votes/1.json
  def update
    if @vote.update(vote_params)
      render json: { message: "Updated successfully" }
    else
      render json: { errors: @vote.errors, status: :unprocessable_entity}
    end
  end

  # DELETE /votes/1.json
  def destroy
    render json: { message: "Destroy successfull" } if @vote.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vote_params
      params.require(:vote).permit(:user_id, :comment_id, :vote_type)
    end
end
