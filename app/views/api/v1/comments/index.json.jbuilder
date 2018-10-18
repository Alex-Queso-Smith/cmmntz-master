json.array! @comments do |comment|
  json.text comment.text
  json.user do
    json.user_name comment.user.user_name
    json.gender comment.user.gender_display
    json.age_range comment.user.age_range_display

  end
end
