class ImgsController < ApplicationController
    
  before_filter :find_img
  
  def find_img
    @img = Img.find(params[:id])
  end

  def show
    respond_to do |format|
      format.json {render :json => @img}
    end
  end
  
  def feedcss
    respond_to do |format|
      format.json {render :json => @img.css(params[:dimension].to_i)}
    end
  end
  
  
end
