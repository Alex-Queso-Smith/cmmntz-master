class Api::V1::VotesController < ApiController
  load_and_authorize_resource

  before_action :set_vote, :set_comment, only: [:update, :destroy]

  # POST /votes.json
  def create
    @vote = Vote.new(vote_params)
    set_comment

    if @vote.save
      render "api/v1/votes/all_returns"
    else
      render json: { errors: @vote.errors.full_messages, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /votes/1.json
  def update
    if @vote.update(vote_params)
      render "api/v1/votes/all_returns"
    else
      render json: { errors: @vote.errors.full_messages, status: :unprocessable_entity}
    end
  end

  # DELETE /votes/1.json
  def destroy
    if @vote.destroy
      render "api/v1/votes/all_returns"
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    def set_comment
      @comment = Comment.filter_and_sort(current_user, @vote.comment.art_id, @vote.comment.art_type, { comment_id: @vote.comment_id }, [], 1).first
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vote_params
      params.require(:vote).permit(:user_id, :comment_id, :vote_type, :force, :old_top_id)
    end
end
