class Api::V1::CommentsController < ApiController
  load_and_authorize_resource

  before_action :set_comment, only: [:update, :destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = Comment.for_art_type_and_id(params(:art_type), params(:art_id)).includes(:user)
  end

  # POST /comments
  # POST /comments.json
  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      render json: { message: "Created successfully" }
    else
      render json: { errors: @comment.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
    if @comment.update(comment_params)
      render json: { message: "Updated successfully" }
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
