class Api::V1::CommentsController < ApiController
  load_and_authorize_resource

  before_action :set_comment, only: [:update, :destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = Comment.filter_and_sort(current_user, params[:art_id], params[:art_type], {}, 1)
    comment_ids = @comments.map(&:id)
    @replies = Comment.tabulation_for_comments_list(current_user, comment_ids, {})
    comment_ids += @replies.map(&:id)
    @current_users_votes = Vote.for_user_and_comment(current_user.id, comment_ids)
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, comment_ids)
  end

  def show
    @comment = Comment.tabulation_for_individual_comment(current_user, params[:id], {})
    @current_users_votes = Vote.for_user_and_comment(current_user.id, @comment.id)
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, @comment.id)
  end

  # POST /comments
  # POST /comments.json
  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      redirect_to api_v1_comments_path(art_type: @comment.art_type, art_id: @comment.art_id, old_top_id: @comment.old_top_id)
    else
      render json: { errors: @comment.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
    if @comment.update(comment_params)
      @comment = Comment.tabulation_for_individual_comment(current_user, params[:id], {})
      @current_users_votes = Vote.for_user_and_comment(current_user.id, @comment.id)
      @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, @comment.id)

      render "api/v1/comments/show"
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
      params.require(:comment).permit(:user_id, :art_id, :art_type, :text, :anonymous, :vote_types, :parent_id, :force, :old_top_id)
    end
end
