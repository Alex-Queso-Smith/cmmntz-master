json.art do
  json.disabled @art.is_disabled?
  json.deactivated @art.deactivated?
  json.disabled_message @art.disabled_message
  blacklisted = current_user ? current_user.user_blacklisted_for?(@art.gallery_id) : false
  json.user_blacklisted blacklisted
  json.user_can_post current_user.post_eligible?
  json.topics @art.topics_list.split(", ")

  json.comment_requires_approval @art.comment_requires_approval? || false
  json.gallery_comment_etiquette @art.gallery.comment_etiquette
end
