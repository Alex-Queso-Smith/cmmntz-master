class QualityCommentsEmailJob < ApplicationJob
  queue_as :default

  def perform
    last_check = 1.week.ago
    # find users registered more than one week ago whos last check (email log name: 'quality_thread_checker') was > same

    if users.present?
      users.each do |user|
        QualityCommentsForUserThreadJob.perform_later(user, last_check.to_s)
      end
    end
  end
end
