class CommentRatingsController < ApplicationController
  
  def new
    @comment_rating = CommentRating.new
    @comment_rating.comment_id = params[:comment_id]
    @comment_rating.user_id = current_user.id
    
    case params[:act]
    when "like"
      @comment_rating.value = 1
    when "view"
      @comment_rating.value = 1
    when "hide"
      @comment_rating.value = -1
    when "dislike"
      @comment_rating.value = -1
    else
      @comment_rating.value = 0
    end
    
    if @comment_rating.save
      # user = @rating.yum.user
      #       description = "#{@rating.user.name} #{@rating.like}d your post '#{@rating.yum.name}' "
      #       user.notify(yum_comments_url(params[:yum_id]), description)
      # respond_to do |format|
      #   format.html {redirect_to yums_url}
      #   format.js {render :layout => false}
      # end
    else
      flash[:notice] = "failed"
    end
    
  end
end
