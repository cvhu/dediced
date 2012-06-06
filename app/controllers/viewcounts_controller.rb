class ViewcountsController < ApplicationController
  def new
    @viewcount = Viewcount.new
    @viewcount.yum_id = params[:yum_id]
    @viewcount.user_id = params[:user_id]    
    @viewcount.save
  end
  
end
