class ThreadWarningCheckerJob < ApplicationJob
  queue_as :default

  def perform(thread)
    # get listing of all comments for the thread with tabulation
    comments = Comment.complete_listing_for_thread(thread.id)

    # get sublisting of comments matching criteria
    min_warn_count = 3
    min_warn_percent = ".20".to_f

    warned_comments = comments.select { |c| c.warn_count >= min_warn_count && c.warn_percent >= min_warn_percent }

    # if more than half of the comments of the thread match the criteria
    if warned_comments.size >= (comments.size/2)
      # set ALL comments in the thread to require moderation
      comments.update_all(approved: false, approved_by: nil)

      # lock the thread??
      thread.deactivated = true
      thread.save

      # notify the thread's moderator about this activity
      AdminMailer.notify_of_thread_locking(thread, comments, warned_comments).deliver_now
    end


  end
end
