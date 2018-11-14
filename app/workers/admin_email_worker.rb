class AdminEmailWorker
  include Sidekiq::Worker

  def perform(email, subject, content)
    AdminMailer.send_mail(email, subject, content).deliver
  end
end
