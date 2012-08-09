module RecenBayesianHelper
  
  # overall probability of a user liking a yum, given 1) Tags, 2) Comments, 3) Ratings, 4) Author

  def p_userlikeyum(user, yum)
    p = p_likegivenauthor(user, yum.user)
    p *= p_likegiventags(user, yum.tags) 
    p *= p_likegivencomments(user, yum.comments) 
#    p *= p_likegivenratings(user, yum.ratings)
    return p
  end

  def p_userlikeprofile(user, profile)
    p = 0 
    unless profile.yums.empty?
      profile.yums.each do |yum|
        p += p_userlikeyum(user, yum)
      end
      return  p/(profile.yums.count+0.0)
    else
      return p
    end
  end
  
  def s_likeyums(user, yums)
    s = 0
    yums.each do |yum|
      unless yum.ratings.where(:user_id => user.id).empty?
        s += yum.ratings.where(:user_id => user.id).first.value
      end
    end
    return s
  end
  
  
  def s_likecomments(user, comments)
    s = 0
    comments.each do |comment|
      unless comment.comment_ratings.where(:user_id => user.id).empty?
        s += comment.comment_ratings.where(:user_id => user.id).first.value
      end
    end
    return s
  end
  
  
  def p_likegivenauthor(user, author)
    if author.yums.empty?
      return 1
    else
      return s_likeyums(user, author.yums)/(author.yums.count)
    end
  end
  
  
  def p_likegiventags(user, tags)
    p = 1.0
    if tags.empty?
      return p
    else
      tags.each do |tag|
        p *= p_likegiventag(user, tag)
      end
      return p
    end
  end
  
  def p_likegiventag(user, tag)
    if tag.yums.empty?
      return 1.0
    else
      return s_likeyums(user, tag.yums)/(tag.yums.count + 0.0)
    end
  end
  
  def p_likegivencomments(user, comments)
    p = 1.0
    if comments.empty?
      return p
    else
      comments.each do |comment|
        p *= p_likegivencomment(user, comment)
      end
      return p
    end
  end
  
  def p_likegivencomment(user, comment)
     return s_likecomments(user, comment.user.comments)/(comment.user.comments.count + 0.0)
  end
    
end