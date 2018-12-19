class ActivityPollerJob < ApplicationJob
  queue_as :default

  def perform
    last_run = 20.minutes.ago
    # find arts with activity since last_run
    threads = Art.with_activity_since(last_run)
    threads.each do |thread|
      ActivityCheckerJob.perform_later(thread, last_run.to_s)
      # if the thread is not set to ignore warning checkers
      if !thread.ignore_warning_checker && !thread.disabled && !thread.deactivated
        ThreadWarningCheckerJob.perform_later(thread)
      end
    end

  end
end
