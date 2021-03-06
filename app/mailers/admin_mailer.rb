class AdminMailer < ApplicationMailer
  add_template_helper(CommentsHelper)
  add_template_helper(ApplicationHelper)
  default :from => "do_not_reply@cmmntz.com"

  def send_mail(to, subject, content)
    @content = content
    mail(to: to, subject: subject)
  end

  def send_thread_activity_warning(email, thread, reasons)
    @reasons = reasons
    @thread = thread
    mail(to: email, subject: "CMMNTZ: Activity exceeding thresholds for thread: #{@thread.url}")
  end

  def notify_of_new_comment(thread, comment)
    @thread = thread
    @comment = comment
    mail(to: @thread.moderator.email, subject: "CMMNTZ: New comment pending approval: #{@thread.url}")
  end

  def notify_of_thread_locking(thread, comments, warning_comments)
    @thread = thread
    @comments = comments
    @warning_comments = warning_comments
    mail(to: @thread.moderator.email, subject: "CMMNTZ: Thread has been locked and requires moderation: #{@thread.url}")
  end
end
