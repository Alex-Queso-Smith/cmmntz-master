json.user do
  json.user_name @user.user_name
  json.email @user.email || ""
  json.age_range @user.age_range || ""
  json.gender @user.gender || ""
  json.longitude @user.longitude || ""
  json.latitude @user.latitude || ""
  json.font @user.font || "serif"
  json.avatar_image @user.base_image || ""
  json.color_theme @user.color_theme || "light"
end
