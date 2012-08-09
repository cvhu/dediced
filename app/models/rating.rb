class Rating < ActiveRecord::Base
  belongs_to :yum
  belongs_to :user
  

  
  def like
    if self.value==0
      "like"
    else
      "dislike"
    end
  end
  
  def scoreDiff
    areas = []
    self.yum.tags.each do |tag|
      diff = {}
      i = tag.interests.where(:user_id => self.user_id).last
      diff[:area] = tag.name
      if self.value > 0
        ups = i.up - 1
        downs = i.down
      else
        if self.value < 0
          downs = i.down - 1
          ups = i.up
        else
          prev = self.yum.ratings.where(:user_id => self.user.id)[-2]
          if prev.value > 0
            ups = i.up + 1
            downs = i.down
          else
            ups = i.up
            downs = i.down + 1
          end
        end
      end
      diff[:before] = (ups+1.0)/(ups+downs+2.0)
      diff[:after] = i.score
      areas << diff
    end
    return areas
  end
  
end
