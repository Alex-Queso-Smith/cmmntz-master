class ActivityPollerJob < ApplicationJob
  queue_as :default

  def perform
    last_run = 20.minutes.ago
    # find arts with activity since last_run
    threads = Art.with_activity_since(last_run)
    threads.each { |thread| ActivityCheckerJob.perform_later(thread, last_run.to_s) }
  end
end
