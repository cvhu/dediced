class NotificationsController < ApplicationController
  
  def index
    @notification_dates = current_user.notifications.order('created_at desc').group_by{ |notification| notification.created_at.strftime("%b %d") }
    unless @notification_dates.empty?
      viewed_all
    end
    respond_to do |format|
      format.html
      format.js {render :layout => false}
    end
  end
  
  
  def destroy
    @notification = Notification.find(params[:id])
    @notification.destroy
    
    respond_to do |format|
      format.html {redirect_to(notifications_url)}
    end
  end
  
  def viewed_all
    @notifications = current_user.notifications
    @notifications.each do |notification|
      notification.viewed = true
      notification.save
    end
  end
  
  def destroy_all
    @notifications = current_user.notifications
    @notifications.destroy_all
    respond_to do |format|
      format.html {redirect_to(notifications_url)}
    end
  end
  
  
end
