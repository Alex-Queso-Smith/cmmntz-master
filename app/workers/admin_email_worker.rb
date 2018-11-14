class AdminEmailWorker
  include Sidekiq::Worker

  def perform(user, subject, content)
    AdminMailer.send_mail(user.email, "Classifilter: #{subject}", content).deliver
  end
end
