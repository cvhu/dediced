class PreUserMailer < ActionMailer::Base
  default :from => "postman@dediced.com"
  
  def subscribe_welcome_email(pre_user)
    
    @pre_user = pre_user
    mail(:to => pre_user.email,
         :subject => "Thank you for subscribing to dediced.com") do |format|
           format.text
           format.html
    end
  end
  
  def invitation_email(pre_user, sign_up_url)
    @pre_user = pre_user
    @sign_up_url = sign_up_url
    mail(:to => pre_user.email,
        :subject => "Congratulations! You are invited as our first round testers!") do |format|
          format.text
          format.html
    end
  end
  
  
  
end
