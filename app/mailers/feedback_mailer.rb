class FeedbackMailer < ApplicationMailer
  default :from => "do_not_reply@classibridge.com"

  def email_team(feedback)
    @feedback = feedback
    from_email = "Beta#{@feedback.type}s@classibridge.com"
    mail(from: from_email, to: "betatest@classibridge.com", subject: "Classifilter: #{@feedback.type} report")
  end

  def email_user_bug(feedback)
    @feedback = feedback
    mail(to: feedback.user.email, subject: "Thanks From Classibridge - BUG")
  end

  def email_user_feedback(feedback)
    @feedback = feedback
    mail(to: feedback.user.email, subject: "Thanks From Classibridge - FEEDBACK")
  end
end
