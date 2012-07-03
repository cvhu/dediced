class PreUsersController < ApplicationController
  
  before_filter :authenticate, :except => ["new", "show", "create", "search", "createPreUser", "createAPI"]
  # GET /pre_users
  # GET /pre_users.xml
  
  def index
    @pre_users = PreUser.all
    respond_to do |format|
      format.json  { render :json => @pre_users, :only=>[:email]}
      format.html # index.html.erb
      format.xml  { render :xml => @pre_users }
    end
  end
  
  def search
    @pre_user = PreUser.where('email LIKE ?', "%#{params[:email]}%")
    respond_to do |format|
      format.json {render :json => @pre_user, :only => [:email]}
    end
  end
  # def validation
  #    @pre_users = PreUser.all
  #    respond_to do |format|
  #      format.json {render :json => @pre_users, :only => [:email]}
  #    end
  #  end
 
  # GET /pre_users/1
  # GET /pre_users/1.xml
  def show
    @pre_user = PreUser.find(params[:id])
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @pre_user }
    end
  end

  # GET /pre_users/new
  # GET /pre_users/new.xml
  def new
    if current_user
      redirect_to stream_path
    else
      @pre_user = PreUser.new
      respond_to do |format|
        format.html # new.html.erb
        format.xml  { render :xml => @pre_user }
      end
    end
  end

  # POST /pre_users
  # POST /pre_users.xml
  def create
    @pre_user = PreUser.new(params[:pre_user])
    respond_to do |format|
      if @pre_user.save
        PreUserMailer.subscribe_welcome_email(@pre_user).deliver
        format.html { redirect_to(@pre_user) }
        format.xml  { render :xml => @pre_user, :status => :created, :location => @pre_user }
        format.js {render :layout => false}
        format.json{render :json => @pre_user.to_json}
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @pre_user.errors, :status => :unprocessable_entity }
      end
    end
  end


  # DELETE /pre_users/1
  # DELETE /pre_users/1.xml
  def destroy
    @pre_user = PreUser.find(params[:id])
    @pre_user.destroy

    respond_to do |format|
      format.html { redirect_to(pre_users_url) }
      format.xml  { head :ok }
    end
  end
  
  def invite
    @pre_user = PreUser.find(params[:pre_user_id])
    if @pre_user.update_attribute(:token, Digest::SHA1.hexdigest([Time.now, rand].join))
      PreUserMailer.invitation_email(@pre_user, sign_up_url(@pre_user.token)).deliver
      flash[:notice] = "#{@pre_user.email} has been invited! (mailed token #{@pre_user.token} to #{@pre_user.email})"
      redirect_to pool_url
    else
      flash[:error] = "not invited"
      redirect_to pool_url
    end
  end
    
    
    
  
  def createPreUser    
    @preuser = PreUser.new(params[:pre_user])
    if @preuser.save          
      logger.debug "JSON: #{@preuser.to_json}"
      
      respond_to do |format|
        format.json{render :json => @preuser.to_json}
      end
      PreUserMailer.subscribe_welcome_email(@preuser).deliver 
    else
      flash[:error] = "failed"
    end
  end
  
  def createAPI
    @pre_user = PreUser.new()
    @pre_user.email = params[:email]
    @pre_user.token = Digest::SHA1.hexdigest([Time.now, rand].join)
    if @pre_user.save
      message = 'Thank you! Please check your email to confirm.'    
      PreUserMailer.sign_up_email(@pre_user, sign_up_url(@pre_user.token)).deliver   
    else
      message = 'Sorry something went wrong X( We will look into this issue as soon as we can!'
    end
    respond_to do |format|
      format.json {render :json => {:message => message}.to_json}
    end
  end
  
  
  protected
  
  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "adminmv" && password == "dealicious2011"
    end
  end
end
