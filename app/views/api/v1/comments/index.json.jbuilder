json.total_comments @comments.size
json.comments @comments do |comment|
  json.id comment.id
  json.text comment.text
  json.created_at comment.created_at
  json.user do
    json.user_name comment_user_user_name(comment)
    json.gender comment_user_gender(comment)
    json.age_range comment_user_age_range(comment)
  end

  json.user_has_voted (@current_users_votes.detect {|v| v.comment_id == comment.id }.present? ? true : false)
  json.current_users_votes do
    Vote::TYPES.each do |type|
      vote = @current_users_votes.detect {|v| v.comment_id == comment.id && v.vote_type == type }
      json.set! type, (!vote.blank? ? vote.id : nil)
    end
  end
end
