class CommentRating < ActiveRecord::Base
  belongs_to :comment
  belongs_to :user
  
  def like
    if self.value==0
      return "like"
    else
      return "dislike"
    end
  end
  
end
