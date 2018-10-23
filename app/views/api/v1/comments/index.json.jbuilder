json.comments @comments do |comment|
  json.id comment.id
  json.text comment.text
  json.created_at comment.created_at
  json.user do
    json.user_name comment_user_user_name(comment)
    json.gender comment_user_gender(comment)
    json.age_range comment_user_age_range(comment)
  end

  json.current_users_votes do
     @current_users_votes.select {|v| v.comment_id = comment.id}.each do |vote|
      json.vote_id vote.id
      json.vote_type vote.type
    end
  end
end
