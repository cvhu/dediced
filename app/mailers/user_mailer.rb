class UserMailer < ActionMailer::Base
  default :from => "postman@dediced.com"   

   def reset_password(user, reset_password_url)
     @user = user
     @reset_password_url = reset_password_url
     mail(:to => user.email,
         :subject => "Did you forget your password?") do |format|
           format.text
           format.html
     end
   end
   
   def feedback_email(email, subject, message)
     @message = message
     @email = email
     mail(
          :from => email,
          :to => 'info@dediced.com',
          :subject => subject) do |format|
            format.html
     end
   end
   
   def share_post(email, subject, yum, user)
     @subject = subject
     @yum = yum
     @email = email
     @user = user
     mail(
           :to => email,
           :subject => subject) do |format|
             format.html
     end
   end
   
end
