SELECT
  comments.*,
  CHAR_LENGTH(comments.text) as comment_length,
  /* summation of voted*/
  sum(case when votes.vote_type  = 'top' then 1 else 0 end) as top_count,
  sum(case when votes.vote_type  = 'love' then 1 else 0 end) as love_count,
  sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end) as like_a_lot_count,
  sum(case when votes.vote_type  = 'like' then 1 else 0 end) as like_count,
  sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end) as indifferent_count,
  sum(case when votes.vote_type  = 'dislike' then 1 else 0 end) as dislike_count,
  sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end) as dislike_a_lot_count,
  sum(case when votes.vote_type  = 'trash' then 1 else 0 end) as trash_count,
  sum(case when votes.vote_type  = 'warn' then 1 else 0 end) as warn_count,
  sum(case when votes.vote_type  = 'smart' then 1 else 0 end) as smart_count,
  sum(case when votes.vote_type  = 'funny' then 1 else 0 end) as funny_count,
  sum(case when votes.vote_type  = 'happy' then 1 else 0 end) as happy_count,
  sum(case when votes.vote_type  = 'shocked' then 1 else 0 end) as shocked_count,
  sum(case when votes.vote_type  = 'sad' then 1 else 0 end) as sad_count,
  sum(case when votes.vote_type  = 'boring' then 1 else 0 end) as boring_count,
  sum(case when votes.vote_type  = 'angry' then 1 else 0 end) as angry_count,
  /* vote percents */
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'top' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as top_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'love' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as love_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as like_a_lot_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'like' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as like_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as indifferent_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'dislike' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as dislike_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as dislike_a_lot_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'trash' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as trash_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'warn' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as warn_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'smart' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as smart_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'funny' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as funny_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'happy' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as happy_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'shocked' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as shocked_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'sad' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as sad_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'boring' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as boring_percent,
  (case when comments.interactions_count > 0 then (sum(case when votes.vote_type  = 'angry' then 1 else 0 end)::DECIMAL/(comments.interactions_count)::DECIMAL) else 0 end) as angry_percent,
  /* like score */
  (case when comments.interactions_count > 0
    then
      (
        (sum(case when votes.vote_type  = 'like_a_lot' then 1 else 0 end)::DECIMAL * 2) +
        (sum(case when votes.vote_type  = 'like' then 1 else 0 end)::DECIMAL * 1) +
        (sum(case when votes.vote_type  = 'indifferent' then 1 else 0 end)::DECIMAL * 0) -
        (sum(case when votes.vote_type  = 'dislike' then 1 else 0 end)::DECIMAL * .5) -
        (sum(case when votes.vote_type  = 'dislike_a_lot' then 1 else 0 end)::DECIMAL * 1)
    ) / (2 * comments.interactions_count)::DECIMAL
    else 0::DECIMAL
  end) as like_score
from comments
left join votes on (votes.comment_id = comments.id)
group by comments.id
