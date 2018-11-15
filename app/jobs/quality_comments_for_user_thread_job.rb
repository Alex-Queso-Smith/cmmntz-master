class QualityCommentsForUserThreadJob
  queue_as :default

  def perform(user, last_check)
    # find threads the the user has posted to having activity since last check
    # threads.each
    #   find quality Quality Comments
    #   add thread to quality_threads if quality comments
    # end

    # if quality_threads not empty
    #   send_email
    #   create email_log
    # else
    #   create email_log
    # end 
  end
end
