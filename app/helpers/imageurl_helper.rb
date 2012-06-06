module ImageurlHelper
  
  def img_url(url, images)
    img_urls = []
    images.each do |image|
      tmp = image_url(url,image["src"])
      if image_filter(tmp)
        img_urls << tmp
      end
    end
    return img_urls
  end
  
  def image_filter(img_src)
    begin 
      image = Magick::Image::read(img_src).first
      # unless image.format == "JPG" ||image.format == "PNG" || image.format == "GIF" ||image.format == "JPEG"
      #   return false
      # else
        if image.rows/(image.columns + 0.0) > 2.5 || image.columns/(image.rows + 0.0) > 3
          return false
        else
          if image.rows*image.columns < 2000 || image.rows*image.columns > 1000000
            return false
          else
            return true
          end
        end
      # end
    rescue Magick::ImageMagickError
      return false
    end
  end
  
  def image_url(url, img_src)
    url_array = url.split("/")
    img_array = img_src.split("/")
    if  img_array[0] != "http:" # image source doesn't start with http://
      if img_src[0] == 47               # image source starts with root '/'
        img_uri = "http://"+ url_array[2]+img_src
      else
        if url_array.length == 3
          if url[-1] != 47
            img_uri = url + "/" + img_src
          else 
            img_uri = url + img_src
          end
        else
          unless url_array.last=~/[\.\=\?]+/
            if url_array.last[-1] == 47
              img_uri = url + img_src
            else
              img_uri = url + "/" + img_src
            end
          else
            img_uri = url_array[0..-2].join("/")+"/"+img_src
          end
        end
      end
    else
      img_uri = img_src
    end
    return img_uri
  end
  
end