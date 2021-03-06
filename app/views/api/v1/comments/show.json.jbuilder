if @old_top_id
  json.old_top_id @old_top_id
end

json.comment do
  json.partial! 'api/v1/shared/comment', comment: @comment, replies: @replies, current_users_interactions: @current_users_interactions, current_users_votes: @current_users_votes, gallery_admins: @gallery_admins, all_comments_size: @all_comments_size

  if @replies
    json.replies @replies.select { |r| r.parent_id == comment.id } do |reply|
      json.partial! 'api/v1/shared/comment', comment: reply, current_users_interactions: current_users_interactions, current_users_votes: current_users_votes, gallery_admins: gallery_admins
    end
  else
    json.replies []
  end
end
