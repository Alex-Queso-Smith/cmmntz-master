json.art do
  json.disabled @art.is_disabled?
  json.deactivated @art.deactivated
  json.comment_requires_approval @art.comment_requires_approval? || false
  json.gallery_settings do
    json.gallery_comments_from @art.gallery.comments_from
    json.gallery_votes_from @art.gallery.votes_from
    json.gallery_filter_list @art.gallery.filter_list
    json.gallery_not_filter_list @art.gallery.not_filter_list
    json.gallery_sort_dir @art.gallery.sort_dir
    json.gallery_sort_type @art.gallery.sort_type
    json.gallery_censor @art.gallery.censor
    json.gallery_thread_expiration_days @art.gallery.default_art_thread_expiration_days
    json.gallery_comment_etiquette @art.gallery.comment_etiquette
  end
end
