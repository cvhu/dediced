class SessionsController < ApplicationController
  def new
  end
  
  def create
    user = User.authentication(params[:email], params[:password])
    
    if user
      session[:user_id] = user.id
      redirect_to user_profile_url(user.name), :notice => "Logged in!"
    else
      flash.now.alert = "Invalid email or password"
      render "new"
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Logged out!"
  end
  
  
  def create_mobile
    user = User.authentication(params[:email], params[:password])
    if user
      @mobiletoken = MobileToken.create({:token => BCrypt::Engine.generate_salt, :user_id => user.id})
      respond_to do |format|
        format.html
        format.xml  { render :xml => @mobiletoken}
        format.json  { render :json => @mobiletoken}
      end
    else
      respond_to do |format|
        format.json {render :json => nil}
      end
    end
  end
  

end
