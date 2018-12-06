class Api::V1::CommentFiltersController < ApiController
  # POST /comments.json
  def create
    page = params[:page] || 1
    search = params[:search] || {}
    @comments = Comment.filter_and_sort(current_user, params[:art_id], params[:art_type], search, page)
    comment_ids = @comments.map(&:id)
    @replies = Comment.tabulation_for_comments_list(current_user, comment_ids, search)
    comment_ids += @replies.map(&:id)
    @current_users_votes = Vote.for_user_and_comment(current_user.id, comment_ids)
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, comment_ids)
    @gallery_admins = Art.find(params[:art_id]).gallery_admin_user_account_ids
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search, :page, :art_id, :art_type)#.permit(:user_id, :art_id, :art_type, :text, :anonymous)
    end
end
