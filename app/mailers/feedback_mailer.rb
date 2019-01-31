class FeedbackMailer < ApplicationMailer
  default :from => "do_not_reply@cmmntz.com"

  def email_team(feedback)
    @feedback = feedback
    @user = @feedback.user
    from_email = "Beta#{@feedback.type}s@cmmntz.com"
    mail(from: from_email, to: "betatest@cmmntz.com", subject: "CMMNTZ: #{@feedback.type} report")
  end

  def email_user_bug(feedback)
    @feedback = feedback
    mail(to: feedback.email, subject: "Thanks From CMMNTZ - BUG")
  end

  def email_user_feedback(feedback)
    @feedback = feedback
    mail(to: feedback.email, subject: "Thanks From CMMNTZ - FEEDBACK")
  end
end
