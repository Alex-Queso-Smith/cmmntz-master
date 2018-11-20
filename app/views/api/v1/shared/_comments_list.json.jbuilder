json.total_comments comments.total_entries
if params[:old_top_id]
  json.old_top_id params[:old_top_id]
end
json.comments comments do |comment|
  json.partial! 'api/v1/shared/comment', comment: comment, current_users_interactions: current_users_interactions, current_users_votes: current_users_votes

  json.replies replies.select { |r| r.parent_id == comment.id } do |reply|
    json.partial! 'api/v1/shared/comment', comment: reply, current_users_interactions: current_users_interactions, current_users_votes: current_users_votes
  end
end
