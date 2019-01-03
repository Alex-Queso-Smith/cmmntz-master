class FeedbackMailer < ApplicationMailer
  default :from => "do_not_reply@classifilter.com"

  def send_quality_comments_found_mail(feedback)
    @feedback = feeback
    mail( to: "jesse@classibridge.com", subject: "Classifilter: #{@feedback.type} report")
  end
end
