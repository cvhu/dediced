class Yum < ActiveRecord::Base
  attr_accessible :user_id, :review, :value, :name, :url, :img_id, :get_token
  
  belongs_to :user
  has_many :comments, :dependent => :destroy
  has_many :ratings, :dependent => :destroy
  has_many :tag_yums, :dependent => :destroy
  has_many :tags, :through => :tag_yums
  has_many :viewcounts, :dependent => :destroy
  
  has_many :yum_interests, :dependent => :destroy
  
  has_many :indexes, :dependent => :destroy
  
  belongs_to :img, :dependent => :destroy
  
  attr_accessible :tag_tokens
  attr_reader :tag_tokens
  
  attr_accessible :address, :longitude, :latitude

  scope :with_address, where("address IS NOT NULL")
  after_initialize :init
  
  def get_token
    if self.token.nil? or self.token!=self.build_token
      # self.token = Digest::MD5.hexdigest(self.id.to_s)
      self.token = self.build_token
      self.save
    end
    return self.token
  end  

  def build_token
    token_list = []
    self.name.split(/[^a-zA-Z0-9]+/).each do |word|
      token_list << word.downcase
    end
    token = token_list.join('-')
    current = token
    count = 0 
    while ((not Yum.where(:token => current).include?(self)) and (not Yum.where(:token => current).empty?))
      count += 1
      current = token + '-'+count.to_s
    end
    return current
  end
  
  def init
    if self.img.nil?
      self.img = Img.new    
    end
  end

  def tag_tokens=(ids)
    self.tags << ids.split(",").map do |id|
      if Tag.where(:id => id).empty?
        Tag.create({:name => id})
      else
        Tag.find(id)
      end
    end
  end
  
  def self.search(search)
    if search == "*"
      scoped
    else
      if search != ""
        where('name LIKE ?', "%#{search}%")
      end
    end
  end
  
  def totalRating
    ups = 0
    downs = 0
    if not ratings.last.nil?
      self.ratings.group_by(&:user_id).each do |user_id, ratings|
        value = ratings.last.value
        if  value > 0
          ups = ups + 1
        end
        if value < 0
          downs = downs + 1
        end
      end
    end
    return {:ups => ups, :downs => downs}
  end
  
  def voteBy(user_id)
    rating = self.ratings.where(:user_id => user.id).last
    if rating.nil?
      return nil
    else
      return rating.value
    end
  end
  
  def selfRating(user_id)
    if not user_id.nil?
      rating = self.ratings.where(:user_id => user_id).last
      if rating.nil?
        return nil
      else
        return rating.value
      end
    else
      return nil
    end
  end
  
  include ActionView::Helpers::DateHelper    
  
  require 'open-uri'
  require 'nokogiri'
  
  def img_src
    url = URI::escape("http://www.google.com/search?q=#{self.name}&tbm=isch")    
    begin
      doc = Nokogiri::HTML(open(url))
      return doc.css('img').first['src']
    rescue
      return nil
    end    
  end
  
  def api2
    {
      :id => self.id,
      :img => self.img_src,
      :created_at => time_ago_in_words(self.created_at),
      :name => self.name,
      :url => self.url
    }
  end
  
  def api(user_id)    
    jsonData = {
      :yum => {:id => self.id, :user_id => self.user_id, :review => self.review, :created_at => time_ago_in_words(self.created_at), :name => self.name, :url => self.url, :token => self.get_token}, 
      :tags => self.tags.select('name'), 
      :imgsrc => self.img.uri, 
      :imgcss => self.img.css(150), 
      :user => {:name => self.user.name, :gravatar25 => self.user.gravatar(25), :imgsrc => self.user.img.uri, :imgcss => self.user.img.css(50)}, 
      :rating => {:self => self.selfRating(user_id),:total => self.totalRating},
      :viewcounts => self.viewcounts.count
    }
    return jsonData
  end
  
  def api_anonymous
    jsonData = {:yum => {:id => self.id, :user_id => self.user_id, :review => self.review, :created_at => self.created_at, :name => self.name, :url => self.url, :token => self.get_token}, :tags => self.tags.select('name'), :imgsrc => self.img.uri, :imgcss => self.img.css(150), :user => {:name => self.user.name, :gravatar25 => self.user.gravatar(25), :imgsrc => self.user.img.uri, :imgcss => self.user.img.css(50)}, :rating => {:self => 0,:total => self.totalRating}}
    return jsonData
  end

  
  def interestsBy(user_id)
    interests = []
    i = 0
    score = 1.0
    self.tags.each do |tag|
      self.user.strengthsOf(tag.name)
      interest = tag.interestBy(user_id)
      score *= interest.score
      interests << {:area => interest.tag.name, :score => interest.score}
      i += 1
    end
    if i == 0
      score = 0.5
    end
    score = score**(1.0/interests.length)
    
    @yum_interests =  self.yum_interests.where(:user_id => user_id)
    unless @yum_interests.count()==1
      @yum_interests.destroy_all
      @yum_interest = YumInterest.new
    else
      @yum_interest = @yum_interests[-1]
    end
    @yum_interest.user_id = user_id
    @yum_interest.yum_id = self.id
    @yum_interest.score = score
    @yum_interest.save
    
    if Index.where(:yum_id => self.id).empty?()
      self.generateIndex()
    end
    
    return {:score => score, :yum_api => self.api(user_id),  :list => interests}
  end
  
  
  def generateIndex
    keywordParser(self.name, 1)
    keywordParser(self.review, 2)
    # doc = Nokogiri::HTML(open(self.url))
    # doc.css('link').each {|node| node.remove}
    # doc.css('script').each {|node| node.remove}
    # body = doc.css('body').text
    # keywordParser(body, 3)
    self.tags.each do |tag|
      keywordParser(tag.name, 4)
    end
  end  
  
  def keywordParser(string, section)
    @blacklist =  ['and', 'the', 'for', 'such']
    count = 0
    string.split(/[^a-z\-A-Z0-9]+/).each do |word|
      word.downcase!
      if (word.length >= 3) and (not @blacklist.include?(word)) and (/^[\d]+$/=~word).nil?
        count += 1
        
        keyword = Keyword.where(:value => word)
        if keyword.empty?()
          keyword = Keyword.new
          keyword.value = word
          keyword.save
        else
          keyword = keyword[0]
        end
        
        index = Index.where(:yum_id => self.id, :section => section, :keyword_id => keyword.id, :position => count)
        if index.empty?()       
          index = Index.new
          index.yum_id = self.id
          index.keyword_id = keyword.id
          index.position = count
          index.section = section
          index.save
        end
      end
    end
  end
   
  def queryMatch(queries)
    queries.each do |q|
      k = Keyword.find_by_value(q)
      if k.nil?()
        return false
      else
        if k.indexes.where(:yum_id => self.id).empty?()
          return false
        end
      end
    end
    return true
  end     
  
end