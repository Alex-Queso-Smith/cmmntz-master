class UserThreadMailer < ApplicationMailer
  default :from => "do_not_reply@classifilter.com"

  def send_quality_comments_found_mail(user, quality_threads)
    @quality_threads = quality_threads
    @user = user
    mail( to: @user.email, subject: "Classifilter: There has been some interesting activity since your last check.")
  end
end
