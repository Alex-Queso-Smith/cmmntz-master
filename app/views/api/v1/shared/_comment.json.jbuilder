json.id comment.id
json.art_id comment.art_id
json.art_url comment.art.url
json.approved comment.approved?
json.text comment.text
json.censored_text comment.censored_text
json.created_at display_time_ago(comment.created_at)
json.edited comment.edited?
json.reply comment.parent_id?
json.user do
  json.user_id comment.user_id
  json.user_name comment_user_user_name(comment)
  json.latitude comment_user_latitude(comment)
  json.longitude comment_user_longitude(comment)
  json.gender comment_user_gender(comment)
  json.age_range comment_user_age_range(comment)
  json.base_image comment_user_base_image(comment)
  json.show_censored comment_user_show_censored(comment)
  json.gallery_admin comment.by_admin_of?(gallery_admins)
  json.posted_as_guest comment.guest?
end

  user_has_interacted = current_users_interactions.detect { |i| i.comment_id == comment.id }.present?
  json.user_has_voted user_has_interacted
  json.current_users_votes do
    Vote::TYPES.each do |type|
      vote = current_users_votes.detect { |v| v.comment_id == comment.id && v.vote_type == type }
      json.set! type, (!vote.blank? ? vote.id : nil)
    end
  end

  json.partial! 'api/v1/shared/vote_breakdown', comment: comment, user_has_interacted: user_has_interacted
