grouped_votes = comment.votes.group_by {|v| v.vote_type}
group_counts = grouped_votes.map {|k, v| [k, ((v.length.to_f/comment.interactions_count.to_f)*100).round] }.to_h

json.vote_percents do
  Vote::TYPES.each do |type|
    json.set! type, (user_has_interacted ? (group_counts[type] || 0) : 0)
  end
end
