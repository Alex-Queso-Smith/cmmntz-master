json.total_comments comments.total_entries
json.comments comments do |comment|
  json.partial! 'api/v1/shared/comment', comment: comment, current_users_interactions: current_users_interactions, current_users_votes: current_users_votes
end
