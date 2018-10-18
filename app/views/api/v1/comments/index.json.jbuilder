json.comments @comments do |comment|
  json.text comment.text
  json.created_at comment.created_at
  json.user do
    json.user_name (comment.user.user_name unless comment.anonymous?)
    json.gender (comment.user.gender_display unless comment.anonymous?)
    json.age_range (comment.user.age_range_display unless comment.anonymous?)
  end
end
