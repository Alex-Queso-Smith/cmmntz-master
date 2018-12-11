json.total_interactions comment.interactions_count

json.vote_counts do
  Vote::TYPES.each do |type|
    vote_count = comment.send("#{type}_count")
    json.set! type, vote_count || 0
  end
end

json.vote_percents do
  Vote::TYPES.each do |type|
    vote_per = (comment.send("#{type}_percent").to_f * 100).round
    json.set! type, vote_per || 0
  end
end
