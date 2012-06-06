module LocationsHelper
  
  def static_map(yums)
    out = "http://maps.google.com/maps/api/staticmap?size=700x500&sensor=false&zoom=13"
    yums.each do |yum| 
      out = out + "&markers=#{yum.latitude}%2C#{yum.longitude}"
    end
    return out
  end
  
  
  def categorize_location(objs)
    maps = {}
    objs.each do |obj|
      unless Geocoder.search(obj.address)[0].nil?
        location = Geocoder.search(obj.address)[0].city
        unless maps.keys.member? location
          maps[location] = [obj.id]
        else
          maps[location] << [obj.id]
        end
      end
      logger.debug "#{maps}: #{obj.address}"
    end
    return maps
  end
 
  def count_location(objs)
    maps = {}
    objs.each do |obj|
      unless Geocoder.search(obj.address)[0]==nil
        location = Geocoder.search(obj.address)[0].city
        unless maps.keys.member? location
          maps[location] = 1
        else
          maps[location] += 1
        end
      end
      logger.debug "#{maps}: #{obj.address}"
    end
    return maps
  end
  
  
  
end
