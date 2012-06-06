ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = {
  :address => "smtp.gmail.com",
  :port => 587,
  :domain => "dediced.com",
  :user_name => "postman@dediced.com",
  :password => "owls10A3",
  :authentication => "plain",
  :enable_starttls_auto => true
}