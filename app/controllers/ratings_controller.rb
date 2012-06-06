class RatingsController < ApplicationController

# like/view: 1
# dislike/hide: -1
  
  def new
    @rating = Rating.new
    @rating.yum_id = params[:yum_id]
    @rating.user_id = current_user.id
    
    case params[:act]
    when "like"
      @rating.value = 1
    when "dislike"
      @rating.value = -1
    else
      @rating.value = 0
    end
    
    if @rating.save
      respond_to do |format|
          format.json{render :json => {:value => @rating.value, :scorediff => @rating.scoreDiff}.to_json}
        end
    else
      flash[:notice] = "failed"
    end
    
  end
  
end
