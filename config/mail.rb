ActionMailer::Base.smtp_settings = {
  :user_name => 'classibridge',
  :password => 'Make1tsoso',
  :domain => 'classifilter.com',
  :address => 'smtp.sendgrid.net',
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}
