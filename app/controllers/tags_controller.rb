class TagsController < ApplicationController
  
  def index 
    @tags = Tag.where("name like ?", "%#{params[:q]}%")
    respond_to do |format|
      format.html
      format.json { render :json => @tags.map(&:attributes)}
    end
  end
  
  def show
    @tag = Tag.where(:name => params[:tag_name]).first
    respond_to do |format|
      format.html
    end
  end
  # 
  # def topUsers
  #   @user_bag = Tag.where(:name => params[:tag_name]).first.relatedUsers
  #   @top_users = Array.new
  #   @user_bag.keys.each do |user_id|
  #     @top_users << {:user_id => user_id, :user => User.find(user_id).name, :count => @user_bag[user_id]}
  #   end
  #   respond_to do |format|
  #     format.json {render :json => @top_users}
  #   end
  # end
  #   
  # def authorsList
  #   @area = Tag.find_by_name(params[:area_name])
  #   respond_to do |format|
  #     format.json {render :json => @area.authorsList.to_json}
  #   end
  # end
  # 
  # def interestsList
  #   @area = Tag.find_by_name(params[:area_name])
  #   respond_to do |format|
  #     format.json {render :json => @area.interestsList.to_json}
  #   end
  # end
  
  def names
    names = []
    Tag.all.each do |tag|
      names << tag.name
    end
    respond_to do |format|
      format.json {render :json => names.to_json}
    end
  end
  
  def contributorsAPI
    @area = Tag.named(params[:name])
    respond_to do |format|
      format.json {render :json => @area.contributors.to_json}
    end
  end
  
  def relatedAreasAPI
    @area = Tag.named(params[:name])
    if current_user
      user_id = current_user.id
    else
      user_id = -1
    end
    respond_to do |format|
      format.json {render :json => @area.relatedAreas(user_id).to_json}
    end    
  end
  
  
  # ############### Dediced 0.7
  def interestAPI
    @tags = Tag.find_by_name(params[:area])
    respond_to do |format|
      format.json {render :json => @tags.interestBy(params[:user_id]).score.to_json}
    end
  end
  
  def authorityAPI
    @tags = Tag.find_by_name(params[:area])
    respond_to do |format|
      format.json {render :json => @tags.interestBy(params[:user_id]).score.to_json}
    end    
  end
  
end
