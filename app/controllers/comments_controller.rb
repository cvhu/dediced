class CommentsController < ApplicationController
  ActiveRecord::Base.include_root_in_json = false
    
  
  def new
    @yum = Yum.find(params[:yum_id])
    @comment = Comment.new
    @comments = @yum.comments
    respond_to do |format|
      logger.debug "*****************#{@comments}"
      format.html
      format.js {render :layout => false}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
      format.xml  { render :xml => @comments }
      format.json  { render :json => @comments }
    end
  end
  
  def create
    @comment = Comment.new(params[:comment])
    @comment.user_id = current_user.id
    if @comment.save
      user = @comment.yum.user
      description = "#{@comment.user.name} commented on your post '#{@comment.yum.name}' "
      user.notify(yum_comments_url(params[:comment][:yum_id]), description)
      flash[:notice] = "comments updated"
      respond_to do |format|
        format.html {redirect_to yum_comments_url(params[:comment][:yum_id])}
        format.js {render :layout => false}
      end
    else
      render "new"
    end
  end


  def createComment
     comment = Comment.new(params[:comment])
     comment.user = current_user
     comment.save     

     respond_to do |format|
       format.json{render :json => comment.api.to_json}
     end
  end
   
  def getByYumId
    @commentsMod = Array.new
    @comments = Yum.find(params[:yum_id]).comments.order('created_at DESC')
    @comments.each do |comment|
      @commentsMod << comment.api
    end
    
    respond_to do |format|
      format.json {render :json =>@commentsMod.to_json}
    end        
  end
end
