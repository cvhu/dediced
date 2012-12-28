class YumsController < ApplicationController
  # before_filter :authorization, :except => ["index", "getBySearch", "getByUser", "getByUserUps", "getByTag", "stream", "streamLatestAPI", "profile", "profileAPI"]
  ActiveRecord::Base.include_root_in_json = false
  
  require 'will_paginate/array'
  
  def show
    @yum = Yum.find_by_token(params[:token])
    @yum_api = @yum.api(current_user.id).to_json
    @viewcount = Viewcount.new
    @viewcount.yum = @yum
    @viewcount.user = current_user
    @viewcount.save
    @viewcounts = @yum.viewcounts
  end
  
  def show_redirect
    @yum = Yum.find_by_token(params[:token])
    @viewcount = Viewcount.new
    @viewcount.yum = @yum
    @viewcount.user = current_user
    @viewcount.save
  end
  
  
  require 'open-uri'
  def crossDomainHTTP
    json = {}
    @uri = params[:uri]
    imgs = []
    count = 0
    
    while imgs.length==0
      count = count + 1
      if count == 3
        break
      else
        begin
          doc = Nokogiri::HTML(open(@uri))
          title = doc.at_css("title").text
        
    
          doc.css("img").each do |img|
            imgs << img.attr('src')
          end
    
          if (title.length==0||imgs.length==0)
            flag = 1
          else
            flag = 0
          end
        rescue
          title = @uri
          imgs = []
        end
      end
    end
    
    json[:title] = title
    json[:img] = imgs
    
    respond_to do |format|
      format.json {render :json =>json.to_json}
    end
  end
  
  def index
  end
  
  
  def createYum
    @yum = Yum.new(params[:yum])
    @yum.user = current_user  
    if not params[:img].nil?
      @img = Img.new(params[:img])
      @yum.img = @img      
      @img.save
    end
    @yum.save
    # @yum.token = Digest::MD5.hexdigest(@yum.id.to_s)
    @yum.token = @yum.build_token
    @yum.save
    logger.debug "--------params: #{params[:yum]}-----"
    @rating = Rating.new
    @rating.yum = @yum
    @rating.user = current_user
    @rating.value = 1
    @rating.save
    
    @user = current_user
    
    respond_to do |format|
      format.json{render :json => api(@yum).to_json}
    end
  end
  
  
  
  # **************** for JSON requests ******************
  
  
  def getById
    @yum = Yum.find(params[:yum_id])
    respond_to do |format|
      format.html
      format.json {render :json => api(@yum).to_json}
    end
  end
  
  

  
  
  def getNamesBySearch
    @yum_names = Yum.order("created_at DESC").search(params[:q]).select(:name)
    respond_to do |format|
      format.json {render :json => @yum_names}
    end
  end
  
  def getBySearch
    @yums = Yum.order("created_at DESC").search(params[:q]).paginate(:page => params[:current_page], :per_page => 16)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end

  
  def shakeLatest
    @yums = Yum.order("created_at DESC").paginate(:page => params[:current_page], :per_page => 16)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end
  
  def shake
    @user = User.find_by_id(params[:user_id])
    respond_to do |format|
      format.html
      format.json {render :json => @user.interestsShake.to_json}
    end
  end
  
  
  
  #-----------------
  
  def selfRating(yum)
    if current_user
      rating = yum.ratings.where(:user_id => current_user.id).last
      if rating.nil?
        return nil
      else
        return rating.value
      end
    else
      return nil
    end
  end
  
  
  
  
  
  
  
  # ################### Dediced 0.7
  
  def profile
    @token = params[:token]
  end
  
  
  def getByTagAPI
    @yums = Tag.where(:name => params[:name]).first.yums.all.paginate(:page => params[:current_page], :per_page => 16)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end
  
  def getByUserAPI
    @yums= User.find(params[:user_id]).yums.order("created_at DESC").paginate(:page => params[:current_page], :per_page => 16)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end
  
  def getByUserUpsAPI
    @yums= User.find(params[:user_id]).upYums.paginate(:page => params[:current_page], :per_page => 16)
    # @yums = WillPaginate::Collection.create(params[:current_page], 16, User.find(params[:user_id]).upYums)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end
  
  def stream
  end
  
  def streamLatestAPI
    @yums = Yum.order("created_at DESC").paginate(:page => params[:current_page], :per_page => 16)
    if @yums.total_pages > @yums.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => apis(@yums), 'more_pages' => more_pages}.to_json}
    end
  end
    
  def streamInterestAPI
    if current_user
      user_id = current_user.id
    else
      user_id = -1
    end
    
    unless YumInterest.where(:user_id => user_id).count() == Yum.all.count()
      YumInterest.where(:user_id => user_id).destroy_all
      Yum.all.each do |yum|
        yum.interestsBy(user_id)
      end
    end
    @yum_interests = YumInterest.where(:user_id => user_id).order("score DESC").paginate(:page => params[:current_page], :per_page => 16)
    if @yum_interests.total_pages > @yum_interests.current_page
      more_pages = 1
    else
      more_pages = 0
    end
    respond_to do |format|
      format.json {render :json => {'apis' => yi_apis(@yum_interests), 'more_pages' => more_pages}.to_json}
    end    
  end
  
  def profileAPI
    @yum = Yum.find_by_token(params[:token])
    @viewcount = Viewcount.new
    @viewcount.yum = @yum    
    if current_user
      @yum_api =  @yum.interestsBy(current_user.id)
      @viewcount.user = current_user
    else
      @yum_api = @yum.interestsBy(-1)
      @viewcount.user_id = -1
    end
    @viewcount.save
    
    respond_to do |format|
      format.json {render :json => @yum_api.to_json}
    end
  end
  
  
  # --- APIS
  def api(yum)
    if current_user
      return yum.interestsBy(current_user.id)
    else
      return yum.interestsBy(-1)
    end
  end
  
  def apis(yums)
    yumsMod = Array.new
    yums.each do |yum|
      yumsMod << api(yum)
    end    
    return yumsMod
  end
  
  def yi_apis(yis)
    yumsMod = Array.new
    yis.each do |yi|
      yumsMod << api(yi.yum)
    end    
    return yumsMod
  end
  
  
  
  
  
  # Dediced 2.0
  # def indexAPI
  
  def indexAPI
    obj = {}
    @links = Yum.order('created_at desc')
    unless params[:offset].nil?
      @links = @links.offset(params[:offset].to_i)
    end
    unless params[:limit].nil?
      @links = @links.limit(params[:limit].to_i)
    end
    obj[:data] = @links.map{|y| y.api2}
    respond_to do |format|
      format.json {render :json => obj.to_json}
    end
  end
  
       
  
end
