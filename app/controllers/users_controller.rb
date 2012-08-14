class UsersController < ApplicationController

  def loggedIn
    unless User.where(:id => session[:user_id]).empty?
      @logged_in = session[:user_id]
    else
      @logged_in = false
    end
    respond_to do |format|
      format.json {render :json => {:logged_in => @logged_in}.to_json}
    end                  
  end

  def new
    @pre_user = PreUser.find_by_token(params[:token])
    if @pre_user.nil?
      @user = User.new
      flash[:notice] = "Sorry, but you need to be invited to sign up"
    else
      @user = User.new
    end
  end
  
  def show
    unless params[:user_name].nil?
      @user = User.find_by_name(params[:user_name])
    else
      @user = User.find(params[:id])
    end
    @yums = @user.yums.order("created_at DESC")
    respond_to do |format|
      format.json {render :json => {:name => @user.name, :img_id => @user.img.uri, :css => @user.img.css(params[:size].to_i)}.to_json}
      format.html
    end
  end
  
  def checkEmails
    @user = User.where(:email => params[:email])
    respond_to do |format|
      format.json {render :json => @user, :only => [:email]}
    end
  end
  
  def checkNames
    @user = User.where(:name => params[:name])
    respond_to do |format|
      format.json {render :json => @user, :only => [:name]}
    end
  end
  
  def create
    @user = User.new(params[:user])
    # @img = Img.new(params[:img])
    # @img.save
    # @user.img = @img

    if @user.save
      session[:user_id] = @user.id
      redirect_to root_url, :notice => "Signed up!"
    else
      render "new"
    end
  end
  
  def edit
    @user = current_user
  end
  
  def update
    @user = User.find(params[:id])
    # @user.img.update_attributes(params[:img])
    if @user.update_attributes(params[:user])
      # flash[:notice] = "Successfully updated profile."
      session[:user_id] = @user.id
      redirect_to root_url #crop_image_url(@user.img.id)
    else
      render :action => 'edit'
    end
  end
  
  
  def relatedTags
    @tag_bag = User.find(params[:user_id]).relatedTags
    @related_tags = Array.new
    @tag_bag.keys.each do |tag|
      @related_tags << {:tag => tag, :count => @tag_bag[tag], :total => Tag.find_by_name(tag).yums.count}
    end
    respond_to do |format|
      format.json {render :json => @related_tags}
    end
  end
  
  def forgotPassword
    respond_to do |format|
      format.html
    end
  end
  
  def sendResetEmail
    @user = User.find_by_email(params[:email])
    @user.update_attribute(:token, Digest::SHA1.hexdigest([Time.now, rand].join))
    UserMailer.reset_password(@user, reset_password_url(@user.token)).deliver
    respond_to do |format|
      format.json {render :json => {"success" => true}.to_json}
    end
  end
  
  def sendFeedbackEmail
    UserMailer.feedback_email(params[:email], params[:subject], params[:message]).deliver
    respond_to do |format|
      format.json {render :json => {"success" => true}.to_json}
    end    
  end
  
  def sendShareEmail
    @user = current_user
    @yum = Yum.find(params[:yum_id])
    @email = params[:email]
    @subject = "[Dediced.com] #{@user.name} shared '#{@yum.name}' with you"
    UserMailer.share_post(@email, @subject, @yum, @user).deliver
    respond_to do |format|
      format.json {render :json => {"success" => true}.to_json}
    end
  end
  

  def resetPassword
    @user = User.find_by_token(params[:token])
    respond_to do |format|
      format.html
    end
  end
  
  def interests
    @user = User.find_by_id(params[:user_id])
    @tag = Tag.find_by_name(params[:area_name])
    respond_to do |format|
      format.json {render :json => @user.interests(@tag).to_json}
    end
  end
  
  def interestsList
    @user = User.find_by_id(params[:user_id])
    respond_to do |format|
      format.json {render :json => @user.interestsList.to_json}
    end
  end
      
  def authors
    @user = User.find_by_id(params[:user_id])
    respond_to do |format|
      format.json {render :json => @user.authors(params[:area_name]).to_json}
    end
  end
  
  def authorsList
    @user = User.find_by_id(params[:user_id])
    respond_to do |format|
      format.json {render :json => @user.authorsList.to_json}
    end
  end
  
  def strengthsAPI
    @user = User.find(params[:user_id])
    respond_to do |format|
      format.json {render :json => @user.strengthsAPI.to_json}
    end
  end
  
  def descriptionAPI
    @user = User.find(params[:user_id])
    respond_to do |format|
      format.json {render :json => {:strengths => @user.authorities.order('score DESC')[0..2].map{|a| {:area => a.tag.name, :score => a.score}}, :interests => @user.interests.order('score DESC')[0..2].map{|i| {:area => i.tag.name, :score => i.score}}}.to_json}
    end
  end
  
  
  # Dediced 2.0
  
  
  
  #   http://api.dediced.com/api/users/fb_signin?access_token=AAAFz21FOd1YBAM4AE2kWbPbhnS4e7cSPQ22vGBpZBZCnyzmYMIHZBzYPWIGSTNC02CIP7h0ATGHwRGTdMstZCqiu1MTdVBlMPwa6gYathWqVkZBKFEqZB7&expires_in=3975&id=100000698352955&name=Peter+Parker&first_name=Peter&last_name=Parker&link=http%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100000698352955&gender=male&email=ch8.portable%40gmail.com&timezone=-5&locale=en_US&updated_time=2011-12-24T23%3A49%3A58%2B0000

  def fbSigninAPI
    obj = {}
    users = User.where(:email => params[:email].downcase)
    unless users.empty?
      user = users.first
      user.update_attribute(:fb_access_token, params[:access_token])
      # user.update_attribute(:fb_access_expiration, Time.now+params[:expires_in].to_i)
      # user.update_attribute(:fb_profile_id, params[:id])
      user.update_login
      obj[:status] = 'success'
      obj[:message] = 'Your facebook account is now connected'
      obj[:token] = user.token      
    else
      user = User.new
      user.email = params[:email].downcase
      user.first_name = params[:first_name]
      user.last_name = params[:last_name]
      user.fb_access_token = params[:access_token]
      # user.fb_access_expiration = Time.now+params[:expires_in].to_i
      # user.fb_profile_id = params[:id]
      user.save
      
      user.updatePassword(params[:access_token])
      user.confirmed = 1
      if user.save      
        user.updateLoginSalt
        # user.buildToken
        obj[:status] = 'success'
        obj[:message] = 'Welcome to Souplus!'
        obj[:token] = user.token
      else
        obj[:status] = 'fail'
        obj[:message] = 'Sorry, somethings went wrong. We will fix it ASAP.'
      end
    end


    respond_to do |format|
      format.json {render :json => obj.to_json}
    end

    # UserMailer.admin_notice('Someone attempts to log in with FB', "Congrats! You've got a new user through facebook: #{user.name} (#{user.email})", "http://souplus.com/@#{user.getUsername}").deliver
  end

end
