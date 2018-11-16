class ActivityCheckerJob < ApplicationJob
  queue_as :default

  def perform(thread, last_check)
    comments = Comment.for_thread_since(thread, last_check)
    votes = Vote.for_thread_since(thread, last_check)

    reasons = []

    if comments.size >= thread.checker_settings[:comments_amount].to_i
      reasons << "There have been #{comments.size} new comments to this thread, which is greater than or equal to your threshold of #{thread.checker_settings[:comments_amount].to_i}."
    end

    thread.checker_settings[:votes].each do |k, v|
      votes_for = votes.select {|vote| vote.vote_type == k.to_s}
      if votes_for.size > v.to_i
        reasons << "There have been #{votes_for.size} new #{k.to_s} votes to this thread, which is greater than or equal to your threshold of #{thread.checker_settings[:votes][k].to_i}."
      end
    end

    unless reasons.blank?
      # email admin
      AdminMailer.send_thread_activity_warning("jesse@classibridge.com", thread, reasons).deliver_now
    end
    puts reasons
    CheckLog.add_log(thread, "thread_activity_checker")
  end
end
