class IndexesController < ApplicationController
  
  def keywordSearchAPI
    respond_to do |format|
      format.json {render :json => Keyword.search(params[:q]).map{|keyword| keyword.value}.to_json}
    end
  end
  
  def searchAPI
    queries = params[:q]
    yums = []
    yum_explored = []
    areas = []
    area_explored = []
    if current_user
      user_id = current_user.id
    else
      user_id = -1
    end
    
    queries.split(/\s+/).each do |query|
      Keyword.search(query).each do |keyword|
        keyword.indexes.each do |index|
          yum = index.yum
          if not yum_explored.include?(yum)
            yums << {:score => 1.1, :yum_api => yum.api(user_id)}
            yum_explored << yum
            yum.tags.each do |tag|
              if not area_explored.include?(tag)
                interests = tag.interests.where(:user_id => user_id)
                if interests.empty?()
                  score = tag.interestBy(user_id).score
                else
                  score = interests[0].score
                end
                area = {:area => tag.name, :score => score, :id => tag.id} 
                if areas.empty?()
                  areas << area
                  area_explored << tag
                else
                  areas.length.times.each do |i|
                    if (areas[i][:score].to_f <= score)
                      areas.insert(i, area)
                      area_explored << tag
                      break
                    else
                      if (i==(areas.length-1))
                        areas << area
                        area_explored << tag
                      end
                    end
                  end
                end
              end
            end          
          end
        end
      end
    end
    
    count = 0
    while yums.length < 16
      unless areas[count].nil?
        tag = Tag.find(areas[count][:id])
        tag.yums.each do |yum|
          if not yum_explored.include?(yum)
            interests = yum.yum_interests.where(:user_id => user_id)
            if interests.empty?()
              yums << yum.interestsBy(user_id)
            else
              yums << {:score => interests[0].score, :yum_api => yum.api(user_id)}
            end            
          end
        end
        count += 1
      else
        break
      end
    end
    
    
    
    respond_to do |format|
      format.json {render :json => {:posts => yums[0..15], :relevant_areas => areas[0..15]}.to_json}
    end
  end
end
