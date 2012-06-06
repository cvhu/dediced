class PagesController < ApplicationController

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
