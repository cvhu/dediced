class Comment < ActiveRecord::Base
  belongs_to :yum
  belongs_to :user
  has_many :comment_ratings, :dependent => :destroy
  
  
  def totalLike
    self.comment_ratings.where(:value => 1).count
  end
  
  def totalHide
    self.comment_ratings.where(:value => -1).count
  end

  include ActionView::Helpers::DateHelper    
  def api
    {:id => self.id, 
     :content=> self.content, 
     :created_at => time_ago_in_words(self.created_at), 
     :user => {:name => self.user.name, 
               :imgsrc => self.user.gravatar(25)}
    }
  end
end
