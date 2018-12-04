json.comment do
  json.partial! 'api/v1/shared/comment', comment: @comment, replies: @replies, current_users_interactions: @current_users_interactions, current_users_votes: @current_users_votes, gallery_admins: @gallery_admins
end
