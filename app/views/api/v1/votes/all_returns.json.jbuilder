json.vote_id @vote.id
json.vote_type @vote.vote_type
json.partial! 'api/v1/shared/vote_percents', comment: @vote.comment_vote_tabulation, user_has_interacted: true
