class QualityCommentsEmailJob < ApplicationJob
  queue_as :default

  def perform(letter = "a")
    last_check = 1.week.ago
    # find users registered more than one week ago whos last check (email log name: 'quality_thread_checker') was > same
    users = User.ready_for_quality_email_check(letter, last_check, 'quality_thread_checker')
    users.each { |user| QualityCommentsForUserThreadJob.perform_later(user, last_check.to_s) } if users.present?

    # # enque the next letter's process
    # (full loop recursion version)
    # letter = letter == "z" ? "a" : letter.next
    # QualityCommentsEmailJob.perform_later(letter)

    # version intended for a scheduler
    unless letter == "z"
      QualityCommentsEmailJob.perform_later(letter.next)
    end
  end
end
