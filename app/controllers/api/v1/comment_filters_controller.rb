class Api::V1::CommentFiltersController < ApiController
  # POST /comments.json
  def create
    # page = params[:page] || 1
    # due to new exclusion param, always pull the first page
    page = 1
    search = params[:search] || {}
    art_id = params[:art_id]

    if params[:search][:topic]
      all_arts = Art.find_by_topic(params[:search][:topic])
      art_id = all_arts.map(&:id)
    end

    @comments = Comment.filter_and_sort(current_user, art_id, params[:art_type], search, page)
    # raise "#{@comments.to_sql}"
    @total_results = Comment.filter_and_sort(current_user, art_id, params[:art_type], search.except(:previous_comment_ids), page).total_entries
    comment_ids = @comments.map(&:id)
    @replies = Comment.tabulation_for_comments_list(current_user, comment_ids, search)
    comment_ids += @replies.map(&:id)
    @current_users_votes = Vote.for_user_and_comment(current_user.id, comment_ids)
    @current_users_interactions = CommentInteraction.for_user_and_comment(current_user.id, comment_ids)
    @art =  Art.find(params[:art_id])

    @gallery_admins = @art.gallery_admin_user_account_ids

    if art_id == params[:art_id]
      @all_comments_size = @art.grand_total_comments(current_user).size
    else
      totals = 0
      all_arts.each do |a|
        totals += a.grand_total_comments(current_user).size
      end
      @all_comments_size = totals
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search, :page, :art_id, :art_type)#.permit(:user_id, :art_id, :art_type, :text, :anonymous)
    end
end
