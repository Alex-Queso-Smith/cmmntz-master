class QualityCommentsEmailJob < ApplicationJob
  queue_as :default

  def perform
    last_check = 1.week.ago
    # find users registered more than one week ago whos last check (email log name: 'quality_thread_checker') was > same
    users = User.ready_for_quality_email_check(last_check, 'quality_thread_checker')
    if users.present?
      users.each do |user|
        QualityCommentsForUserThreadJob.perform_later(user, last_check.to_s)
      end
    end
  end
end
