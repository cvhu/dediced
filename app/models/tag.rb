class Tag < ActiveRecord::Base
  has_many :tag_yums, :dependent => :destroy
  has_many :yums, :through => :tag_yums
  
  has_many :authorities, :dependent => :destroy
  has_many :interests, :dependent => :destroy
  
  def totalVotesFrom(user_id)
    ups = 0
    downs = 0
    if user_id == -1
      self.yums.each do |yum|
        yum.ratings.group_by(&:user_id).each do |user_id, ratings|
          rv = ratings.last.value
          if not rv.nil?
            if rv > 0
              ups += 1
            elsif rv < 0
              downs += 1
            end
          end
        end
      end      
    else
      self.yums.each do |yum|
        rv = yum.voteBy(user_id)
        if not rv.nil?
          if rv > 0
            ups += 1
          elsif rv < 0
            downs += 1
          end
        end
      end
    end
    score = (1.0 + ups)/(2.0 + ups + downs)
    return {:ups => ups, :downs => downs, :score => score}
  end
  
  def totalVotesBy(user_id)
    ups = 0
    downs = 0
    self.yums.where(:user_id => user_id).each do |yum|
      yum.ratings.group_by(&:user_id).each do |user_id, ratings|
        rating = ratings.last
        if rating.value > 0
          ups += 1
        elsif rating.value < 0
          downs += 1
        end
      end
    end
    score = (1.0 + ups)/(2.0 + ups + downs)
    return {:ups => ups, :downs => downs, :score => score}
  end
  
  
  def stats
    ups = 0
    downs = 0
    posts = 0
    self.yums.each do |yum|
      posts += 1
      yum.ratings.group_by(&:user_id).each do |user_id, ratings|
        rating = ratings.last
        if rating.value > 0
          ups += 1
        elsif rating.value < 0
          downs += 1
        end
      end
    end    
    return {:ups => ups, :downs => downs, :posts => posts}
  end
  
  def interestBy(user_id)
    if self.interests.where(:user_id => user_id).last.nil?
      @interest = Interest.new
      @interest.user_id = user_id
      @interest.tag = self
      votes = self.totalVotesFrom(user_id)
      @interest.up = votes[:ups]
      @interest.down = votes[:downs]
      @interest.score = votes[:score]
      @interest.save
    else
      @interest = self.interests.where(:user_id => user_id).last
    end
    return @interest
  end
      
  
  #*************************************
  
  # def interestsList
  #   list = []
  #   skip = []
  #   dict = {}
  #   i = 0
  #   i_score = 1.0
  #   self.yums.each do |yum|
  #     yum.ratings.group_by(&:user_id).each do |user_id, ratings|        
  #       value = ratings.last.value
  #       if (value!=0)&&(not skip.include?(user_id))
  #         user = User.find(user_id)
  #         area_info = user.interests(self)
  #         dict[i] = area_info[:score]
  #         i_score = i_score*area_info[:score]
  #         skip << user_id
  #         list << area_info
  #         i = i + 1
  #       end
  #     end
  #   end
  #   if i == 0
  #     i_score = 0.5
  #   end
  #   i_score = i_score**(1.0/list.length)
  #   list_sorted = []
  #   dict.sort{|a,b| -1*(a[1]<=>b[1])}.each do |pair|
  #     list_sorted << list[pair[0]]
  #   end
  #   return {:score => i_score, :list => list_sorted}
  # end
  
  
  # def authorsList
  #   list = []
  #   skip = []
  #   dict = {}
  #   i = 0
  #   a_score = 1.0
  #   self.yums.each do |yum|      
  #     if not skip.include?(yum.user_id)
  #       user = User.find(yum.user_id)
  #       area_info = user.authors(self.name)
  #       dict[i] = area_info[:score]
  #       a_score = a_score*area_info[:score]
  #       skip << user.id
  #       list << area_info
  #       i = i + 1
  #     end
  #   end
  #   if i == 0
  #     a_score = 0.5
  #   end
  #   a_score = a_score**(1.0/list.length)
  #   list_sorted = []
  #   dict.sort{|a,b| -1*(a[1]<=>b[1])}.each do |pair|
  #     list_sorted << list[pair[0]]
  #   end
  #   return {:score => a_score, :list => list_sorted}
  # end
  
  
  
  # def anonymousInterests
  #   ups = 0
  #   downs = 0
  #   self.yums.each do |yum|
  #     yum.ratings.group_by(&:user_id).each do |user_id, ratings|
  #       rv = ratings.last.value
  #       if not rv.nil?
  #         if rv > 0
  #           ups = ups + 1
  #         end
  #         if rv < 0
  #           downs = downs + 1
  #         end
  #       end        
  #     end
  #   end
  #   score = (1.0+ups)/(2.0+ups+downs)
  #   return {:user_id => 0, :user_name => 'anonymous',:user_gravatar25 => '', :area_name => self.name, :score => score, :ups => ups, :downs => downs}
  # end
  # 
  
  def contributors
    obj = []
    self.authorities.order('score DESC').each do |a|
      obj << {:name => a.user.name, :img => a.user.gravatar(50),:score => a.score, :post => self.yums.where(:user_id => a.user.id).count, :up => a.up}
    end
    return obj
  end
  
  def relatedAreas(user_id)
    explored = []
    areas = []
    self.yums.each do |yum|
      yum.tags.each do |t|
        if not explored.include?(t)
          score = t.interestBy(user_id).score
          area = {:area => t.name, :score => score, :id => t.id}
          if areas.empty?()
            areas << area
            explored << t
          else
            areas.length.times.each do |i|
              if (areas[i][:score].to_f <= score)
                areas.insert(i, area)
                explored << t
                break
              else
                if (i==(areas.length-1))
                  areas << area
                  explored << t
                end
              end
            end
          end
        end
      end
    end    
    return areas
        
  end
  
  def self.named(area_name)
    tags = Tag.where(:name => area_name)
    if tags.count > 1
      tag = tags[0]
      tags[1..-1].each do |t|
        t.tag_yums.map{|ty| ty.update_attributes(:tag_id => tag.id)}
        t.interests.map{|i| i.update_attributes(:tag_id => tag.id)}
        t.authorities.map{|a| a.update_attributes(:tag_id => tag.id)}
        t.delete
      end
    elsif tags.count == 1
      return tags[0]
    else
      return nil
    end
  end
  
end
