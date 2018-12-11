json.vote_percents do
  Vote::TYPES.each do |type|
    vote_per = (comment.send("#{type}_percent").to_f * 100).round
    json.set! type, vote_per || 0
  end
end
