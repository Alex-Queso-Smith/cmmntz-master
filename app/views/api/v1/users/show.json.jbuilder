json.user do
  json.user_name @user.user_name
  json.email @user.email || ""
  json.age_range @user.age_range || ""
  json.gender @user.gender || ""
  json.longitude @user.longitude || ""
  json.latitude @user.latitude || ""
  json.font !@user.font.blank? ? "cf-#{@user.font}" : "cf-serif"
  json.avatar_image @user.base_image || ""
  json.color_theme !@user.color_theme.blank? ? "cf-#{@user.color_theme}" : "cf-light"
  json.base_image @user.base_image
  json.followed_users @user.followed_user_ids
  json.blocked_users @user.blocked_user_ids
  json.admin @user.moderator_for?(params[:gallery_id])
  json.guest @user.guest?

  json.sort_opts do
    object = @user.settings_updated ? @user : defined?(@gallery) ? @gallery : @user
    # object = @user # disable curated views for beta
    json.sort_dir object.sort_dir || "desc"
    json.sort_type object.sort_type || "created_at"
    json.censor object.censor || nil
    json.not_filter_list object.not_filter_list || []
    json.filter_list object.filter_list || []
    json.votes_from object.votes_from || ""
    json.comments_from object.comments_from || ""
    json.gender_search object.gender_search || ""
    json.age_range_search object.age_range_search || ""
    json.hide_anon_and_guest object.hide_anon_and_guest

    json.show_censored_comments @user.show_censored_comments || true
    json.set_from object.class.to_s.downcase
  end
end
