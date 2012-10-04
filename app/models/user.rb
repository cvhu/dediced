class User < ActiveRecord::Base
  has_many :yums, :dependent => :destroy
  has_many :comments, :dependent => :destroy
  has_many :ratings, :dependent => :destroy
  has_many :comment_ratings, :dependent => :destroy
  has_many :mobile_tokens, :dependent => :destroy
  has_many :notifications, :dependent => :destroy
  has_many :viewcounts, :dependent => :destroy
  has_many :yum_interests, :dependent => :destroy
  
  has_many :authorities, :dependent => :destroy
  has_many :interests, :dependent => :destroy
    
  attr_accessible :email, :password, :password_confirmation, :name, :address, :longitude, :latitude, :gravatar, :signup_token, :fb_access_token, :login_salt, :first_name, :last_name
  
  attr_accessor :password
  before_save :encrypt_password
  
  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :email
  validates_uniqueness_of :email
  validates_presence_of :name
  validates_uniqueness_of :name
  after_initialize :init
  
  belongs_to :img, :dependent => :destroy
  
  
  # geocoded_by :address
  # reverse_geocoded_by :latitude, :longitude
  # after_validation :geocode, :reverse_geocode, :if => :address_changed?

  def gravatar(size)
    hash = Digest::MD5.hexdigest(self.email.downcase)
    return "http://www.gravatar.com/avatar/#{hash}?s=#{size}"
  end
    
  require 'bcrypt'
  def authenticate(password)
    self.password_hash == BCrypt::Engine.hash_secret(password, self.password_salt)
  end
  
  def self.authentication(email, password)
    user = find_by_email(email)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end
  
  def notify(url, description)
    notification = Notification.new
    notification.user = self
    notification.url = url
    notification.description = description
    notification.save
  end
  
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end
  
  def init
    self.img ||= Img.new()
    self.name ||= 'anonymous'
    # self.css ||= "width:127px;height:126px;margin-left:-12px;margin-top:-17px"
  end
  
  def totalView
    total = 0
    self.yums.each do |yum|
      total += yum.totalView
    end
    return total
  end
  
  def totalHide
    total = 0
    self.yums.each do |yum|
      total += yum.totalHide
    end
    return total
  end
  
  def commentsScore(user_id)
    like = 0
    hide = 0
    self.comments.each do |comment|
      comment.comment_ratings.where(:user_id => user_id).each do |rating|
        if rating.value = 1
          like += 1
        else 
          if rating.value = -1
            hide +=1
          end
        end
      end
    end
    return {:like => like, :hide => hide}
  end
  
  def relatedTags
    tag_bag = {}
    self.yums.each do |yum|
      yum.tags.each do |tag|
        if tag_bag.keys.include?(tag.name)
          tag_bag[tag.name] += 1
        else
          tag_bag[tag.name] = 1
        end
      end
    end
    # tag_bag_rev = {}
    # tag_bag.keys.each do |tag|
    #   if tag_bag_rev.keys.include?(tag_bag[tag])
    #     tag_bag_rev[tag_bag[tag]] << tag
    #   else
    #     tag_bag_rev[tag_bag[tag]] = [tag]
    #   end
    # end
    # final = {}
    # tag_bag_rev.keys.sort.reverse[0..2].each do |count|
    #   tag_bag_rev[count].each do |tag|
    #     final[tag] = count
    #   end
    # end
    return tag_bag
  end
  
  def views
    view_bag = {}
    self.ratings.where(:value => 1).each do |rating|
      if view_bag.keys.include?(rating.yum_id)
        view_bag[rating.yum_id] += 1
      else
        view_bag[rating.yum_id] = 1
      end
    end
    return view_bag
  end
    
  def totalRating
    uped = 0
    downed = 0
    posts = 0
    self.yums.each do |yum|
      posts = posts + 1
      uped = uped + yum.totalRating[:ups]
      downed = downed + yum.totalRating[:downs]
    end
    return {:posts => posts, :uped => uped, :downed => downed}
  end
  
  def upYums
    yums = []
    self.ratings.order('created_at DESC').group_by(&:yum_id).each do |yum_id, ratings|
      yum = Yum.find(yum_id)
      if yum.user != self and ratings.first.value > 0
        yums << yum
      end
    end
    return yums
  end
  
  # def interests(tag)
  #   ups = 0
  #   downs = 0
  #   tag.yums.each do |yum|
  #     rv = yum.selfRating(self.id)
  #     if not rv.nil?
  #       if rv > 0
  #         ups = ups + 1
  #       end
  #       if rv < 0
  #         downs = downs + 1
  #       end
  #     end
  #   end
  #   score = (1.0+ups)/(2.0+ups+downs)
  #   return {:user_id => self.id, :user_name => self.name,:user_gravatar25 => self.gravatar(25), :area_name => tag.name, :score => score, :ups => ups, :downs => downs}
  # end
  

  def interestsList
    # skip = []
    #     self.ratings.group_by(&:yum_id).each do |yum_id, ratings|
    #       Yum.find(yum_id).tags.each do |tag|
    #         if not skip.include?(tag)
    #           tag.interestBy(self.id)          
    #           skip << tag
    #         end
    #       end
    #     end
    #     
    score = 1.0
    interests = []
    si = self.interests.order("score DESC")
    if si.empty?
      score = 0.5
    else
      si.each do |interest|
        score *= interest.score
        interests << {:area_name => interest.tag.name, :score => interest.score}
      end
    end
    score = score**(1.0/interests.length)    
    return {:score => score, :list => interests}
  end

  
  def authors(area_name)
    tag = Tag.find_by_name(area_name)
    posts = 0
    uped = 0
    downed = 0
    if not tag.nil?
      tag.yums.where(:user_id => self.id).each do |yum|
        posts = posts + 1
        yum.ratings.group_by(&:user_id).each do |user_id, ratings|
            rating = ratings.last
            if rating.value > 0
              uped = uped + 1
            end
            if rating.value < 0
              downed = downed + 1
            end
        end
      end
    end
    score = (1.0+uped)/(2.0+uped+downed)
    return {:user_id => self.id, :user_name => self.name,:user_gravatar25 => self.gravatar(25), :area_name => area_name, :score => score,:posts => posts, :uped => uped, :downed => downed}
  end  
  
  def authorsList
    list = []
    skip = []
    dict = {}
    i = 0
    a_score = 1.0
    self.yums.each do |yum|
      yum.tags.each do |tag|
        if not skip.include?(tag.name)
          area_info = self.authors(tag.name)
          dict[i] = area_info[:score]
          a_score = a_score*area_info[:score]
          skip << tag.name
          list << area_info
          i = i + 1
        end
      end
    end
    if i == 0
      a_score = 0.5
    end
    a_score = a_score**(1.0/list.length)
    list_sorted = []
    dict.sort{|a,b| -1*(a[1]<=>b[1])}.each do |pair|
      list_sorted << list[pair[0]]
    end
    return {:score => a_score, :list => list_sorted}
  end
  
  def authorsYum(yum_id)
    dict = {}
    list = []
    i = 0
    a_score = 1.0
    yum = Yum.find(yum_id)
    yum.tags.each do |tag|
      area_info = self.authors(tag.name)
      dict[i] = area_info[:score]
      a_score = a_score*area_info[:score]
      list << area_info
      i = i + 1
    end
    if i == 0
      a_score = 0.5
    end
    a_score = a_score**(1.0/list.length)
    list_sorted = []
    dict.sort{|a,b| -1*(a[1]<=>b[1])}.each do |pair|
      list_sorted << list[pair[0]]
    end
    return {:score => a_score, :yum => yum, :list => list_sorted}
  end
  

  
  def interestsShake
    dict = {}
    list = []
    i = 0
    Yum.all.each do |yum|
      yum_info = self.interestsYum(yum)
      dict[i] = yum_info[:score]
      list << yum_info
      i = i+1
    end
    list_sorted = []
    dict.sort{|a,b| -1*(a[1]<=>b[1])}.each do |pair|
      list_sorted << list[pair[0]]
    end
    return list_sorted
  end
  
  
  def strengthsAPI
    list = []
    self.authorities.order('score DESC').each do |authority| 
      area = authority.tag
      list << {:area => area.name, :score => authority.score, :id => area.id}
    end
    return list    
  end
  
  def strengthsOf(area_name)
    area = Tag.named(area_name)
    authorities = self.authorities.where(:tag_id => area.id)
    if authorities.empty?
      @authority = Authority.new
      @authority.user_id = self.id
      @authority.tag = area
      votes = area.totalVotesBy(self.id)
      @authority.up = votes[:ups]
      @authority.down = votes[:downs]
      @authority.score = votes[:score]
      @authority.save
    else
      @authority = authorities[0]
    end
    return @authority
  end
  
  
  
  # Dediced 2.0
  
  def api
    {
      :fullname => self.getFullname,
      :name => self.getName
    }
  end
  
  def buildToken
    self.update_attribute(:token, Digest::MD5.hexdigest(self.login_salt, self.email.downcase))
  end
  
  def updateLogin
    list = [('a'..'z'),('A'..'Z'),('0'..'9')].map{|i| i.to_a}.flatten
    self.update_attribute(:login_salt, (0...15).map{list[rand(list.length)]}.join)
    self.buildToken
  end
  
  def updateSignupToken
    list = [('a'..'z'),('A'..'Z'),('0'..'9')].map{|i| i.to_a}.flatten
    self.update_attribute(:signup_token, (0...15).map{list[rand(list.length)]}.join)
  end
  
  def resetToken
    self.update_attribute(:login_salt, nil)
    self.update_attribute(:token, nil)
  end
  
  def getName
    if self.name.nil?
      name = self.first_name.downcase
      username = name
      count = 0
      while not User.where(:name => username).empty?
        count += 1
        username = "#{name}-#{count}"
      end
      self.update_attribute(:name, username)
    end
    return self.name
  end
  
  def getFullname
    if self.first_name.nil? or self.last_name.nil?
      return self.name
    else
      return "#{self.first_name.capitalize} #{self.last_name[0].capitalize}."
    end
  end
  
  def updatePassword(password)
    self.update_attribute(:password_salt, BCrypt::Engine.generate_salt) 
    self.update_attribute(:password_hash, BCrypt::Engine.hash_secret(password, self.password_salt))
  end
  
  
end
