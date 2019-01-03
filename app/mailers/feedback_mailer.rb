class FeedbackMailer < ApplicationMailer
  default :from => "do_not_reply@classifilter.com"

  def email_team(feedback)
    @feedback = feedback
    mail( to: "jesse@classibridge.com", subject: "Classifilter: #{@feedback.type} report")
  end
end
