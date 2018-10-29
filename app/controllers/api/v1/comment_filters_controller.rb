class Api::V1::CommentFiltersController < ApiController
  # POST /comments.json
  def create
    page = params[:page] || 1
    search = params[:search] || {}
    @comments = CommentVoteTabulation.filter_and_sort(params[:art_id], params[:art_type], search, page)
    @current_users_votes = Vote.for_user_and_comment(current_user.id, @comments.map(&:id))
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, @comments.map(&:id))
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search, :page, :art_id, :art_type)#.permit(:user_id, :art_id, :art_type, :text, :anonymous)
    end
end
