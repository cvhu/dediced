class PagesController < ApplicationController
  http_basic_authenticate_with :name => "adminmv", :password => "dealicious2011", :except => [:about_us, :search, :how_it_works, :faq]
  
  def admin
    @users = User.order("created_at DESC")
  end

  def how_it_works
  end
  
  def search
    @total_yums = Yum.all.count
    @total_areas = Tag.all.count    
    @q = params[:q]
  end
  
  def about_us
  end
  
  def faq
  end
  
end
