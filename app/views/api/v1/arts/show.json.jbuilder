json.art do
  json.disabled @art.is_disabled?
  json.deactivated @art.deactivated?
  json.disabled_message @art.disabled_message
  blacklisted = current_user ? current_user.user_blacklisted_for?(@art.gallery_id) : false
  json.user_blacklisted blacklisted

  json.comment_requires_approval @art.comment_requires_approval? || false
  json.gallery_settings do
    json.gallery_comments_from @art.gallery.comments_from || ""
    json.gallery_votes_from @art.gallery.votes_from || ""
    json.gallery_filter_list @art.gallery.filter_list || []
    json.gallery_not_filter_list @art.gallery.not_filter_list || []
    json.gallery_sort_dir @art.gallery.sort_dir || "desc"
    json.gallery_sort_type @art.gallery.sort_type || "created_at"
    json.gallery_censor @art.gallery.censor || false
    json.gallery_thread_expiration_days @art.gallery.default_art_thread_expiration_days
    json.gallery_comment_etiquette @art.gallery.comment_etiquette
  end
end
