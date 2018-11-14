class AdminEmailJob < ApplicationJob
  queue_as :default
  
  def perform(email, subject, content)
    AdminMailer.send_mail(email, subject, content).deliver
  end
end
