class AdminMailer < ApplicationMailer
  default :from => "do_no_reply@classifilter.com"

  def send_mail(to)
    mail( to: to, subject: "Test email")
  end
end
