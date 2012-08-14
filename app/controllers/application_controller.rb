class ApplicationController < ActionController::Base
#  protect_from_forgery
  
  helper_method :current_user, :request
  helper :all



  def render(*args)
    	args.first[:layout] = false if request.xhr? and args.first[:layout].nil?
  	super
  end
  

    
  protected
  
  def authorization
    if current_user
      return true
    else
      redirect_to subscribe_path
    end
  end
  
  private
  
  
  def current_user
    unless User.where(:id => session[:user_id]).empty?
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    else
      session[:user_id] = nil
      return false
    end
  end
  
  after_filter :set_access_control_headers
   
  def set_access_control_headers
   headers['Access-Control-Allow-Origin'] = '*'
   headers['Access-Control-Request-Method'] = '*'
  end
  
  
  
end
