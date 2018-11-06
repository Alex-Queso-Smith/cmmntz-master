json.total_comments comments.total_entries
if params[:old_top_id]
  json.old_top_id params[:old_top_id]
end
json.comments comments do |comment|
  json.partial! 'api/v1/shared/comment', comment: comment, current_users_interactions: current_users_interactions, current_users_votes: current_users_votes

  json.replies comment.replies.sort { |a, b| b.created_at - a.created_at } do |reply|
    json.partial! 'api/v1/shared/comment', comment: reply, current_users_interactions: nil, current_users_votes: nil
  end
end