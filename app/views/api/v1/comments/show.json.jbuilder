json.comment do
  json.partial! 'api/v1/shared/comment', comment: @comment, current_users_interactions: @current_users_interactions, current_users_votes: @current_users_votes
end