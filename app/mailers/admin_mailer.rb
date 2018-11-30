class AdminMailer < ApplicationMailer
  add_template_helper(CommentsHelper)
  add_template_helper(ApplicationHelper)
  default :from => "do_not_reply@classifilter.com"

  def send_mail(to, subject, content)
    @content = content
    mail(to: to, subject: subject)
  end

  def send_thread_activity_warning(email, thread, reasons)
    @reasons = reasons
    @thread = thread
    mail(to: email, subject: "Classifilter: Activity exceeding thresholds for thread: #{@thread.url}")
  end

  def notify_of_new_comment(thread, comment)
    @thread = thread
    @comment = comment
    mail(to: @thread.moderator.email, subject: "Classifilter: New comment pending approval: #{@thread.url}")
  end
end
