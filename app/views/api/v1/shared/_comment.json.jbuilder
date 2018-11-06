json.id comment.id
json.text comment.text
json.created_at display_time_ago(comment.created_at)
json.edited has_been_edited(comment)
json.user do
  json.user_id comment.user_id
  json.user_name comment_user_user_name(comment)
  json.gender comment_user_gender(comment)
  json.age_range comment_user_age_range(comment)
  json.base_image comment_user_base_image(comment)
end

if comment.parent_id.nil?
  user_has_interacted = current_users_interactions.detect {|i| i.comment_id == comment.id}.present?
  json.user_has_voted user_has_interacted
  json.current_users_votes do
    Vote::TYPES.each do |type|
      vote = current_users_votes.detect {|v| v.comment_id == comment.id && v.vote_type == type }
      json.set! type, (!vote.blank? ? vote.id : nil)
    end
  end

  json.partial! 'api/v1/shared/vote_percents', comment: comment, user_has_interacted: user_has_interacted
end