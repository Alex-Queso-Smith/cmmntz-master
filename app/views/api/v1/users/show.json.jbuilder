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
  json.base_image @user.base_image
  json.followed_users @user.followed_user_ids
  json.blocked_users @user.blocked_user_ids
  json.comments_from @user.comments_from || ""
  json.votes_from @user.votes_from || ""
  json.filter_list @user.filter_list || []
  json.not_filter_list @user.not_filter_list || []
  json.sort_dir @user.sort_dir || "desc"
  json.sort_type @user.sort_type || "created_at"
  json.censor @user.censor || nil
  json.show_censored_comments @user.show_censored_comments || true
  json.settings_updated @user.settings_updated || false
  json.admin @user.customer_for?(params[:gallery_id])
  json.guest @user.guest?
end
