class QualityCommentsForUserThreadJob < ApplicationJob
  queue_as :default

  def perform(user, last_check)
    # find threads the the user has posted to having activity since last check
    threads = Comment.threads_with_activity_since_for_user(user.id, last_check)

    if threads.present? # there is activity since last_check for threads that the user has posted to
      quality_threads = []

      threads.each do |thread| # find quality Quality Comments
        quality_comments = Comment.quality_comments_for_thread_since_for_user(thread.art_id, thread.art_type, user, last_check)
        quality_threads << thread if quality_comments.present?
      end

      if quality_threads.present? # there are quality quality_threads found
        UserThreadMailer.send_quality_comments_found_mail(user, quality_threads).deliver_now
      end
    end
    EmailLog.add_log(user, "quality_thread_checker")
  end
end
