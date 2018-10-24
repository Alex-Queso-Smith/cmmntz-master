class Api::V1::CommentsController < ApiController
  load_and_authorize_resource

  before_action :set_comment, only: [:update, :destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = Comment.paginate(page: 1, per_page: 30).filter_and_sort(params[:art_id], params[:art_type])
    @current_users_votes = Vote.for_user_and_comment(current_user.id, @comments.map(&:id))
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
      params.require(:comment).permit(:user_id, :art_id, :art_type, :text, :anonymous)
    end
end
