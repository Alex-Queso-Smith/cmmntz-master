json.comments @comments do |comment|
  json.id comment.id
  json.text comment.text
  json.created_at comment.created_at
  json.user do
    json.user_name comment_user_user_name(comment)
    json.gender comment_user_gender(comment)
    json.age_range comment_user_age_range(comment)
  end
end
