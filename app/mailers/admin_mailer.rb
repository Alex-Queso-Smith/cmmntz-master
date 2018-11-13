class AdminMailer < ApplicationMailer
  default :from => "do_no_reply@classifilter.com"

  def send_mail(to, subject, content)
    @content = content
    mail( to: to, subject: subject)
  end
end
