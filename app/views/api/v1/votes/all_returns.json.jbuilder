json.vote_id @vote.id
json.vote_type @vote.vote_type

json.partial! 'api/v1/shared/vote_percents', comment: @vote.comment, user_has_interacted: true
