class Api::V1::CommentsController < ApiController
  load_and_authorize_resource

  before_action :set_comment, only: [:update, :destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = CommentVoteTabulation.filter_and_sort(params[:art_id], params[:art_type], {}, 1)
    @current_users_votes = Vote.for_user_and_comment(current_user.id, @comments.map(&:id))
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, @comments.map(&:id))
  end

  # POST /comments
  # POST /comments.json
  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      redirect_to api_v1_comments_path(art_type: comment_params[:art_type], art_id: comment_params[:art_id] )
    else
      render json: { errors: @comment.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
    if @comment.update(comment_params)
      redirect_to api_v1_comments_path(art_type: comment_params[:art_type], art_id: comment_params[:art_id] )
    else
      render json: { errors: @comment.errors, status: :unprocessable_entity}
    end
  end

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    render json: { message: "Destroy successfull" } if @comment.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def comment_params
<<<<<<< HEAD
      params.require(:comment).permit(:user_id, :art_id, :art_type, :text, :anonymous, :vote_types)
=======
      params.require(:comment).permit(:user_id, :art_id, :art_type, :text, :anonymous, votes_attributes:[:vote_type, :user_id])
>>>>>>> 3b67470fa46c408e4cac6ed2b163ea8be4fb5855
    end
end
