class LocationsController < ApplicationController

  helper_method :categorize

  def index
    @yums = Yum.with_address
  end
  

  def show
    @address = params[:address]
    @geo = Geocoder.search(@address)[0]
    @latitude = @geo.geometry["location"]["lat"]
    @longitude = @geo.geometry["location"]["lng"]
  end
 
  def search
    search = params[:q]
    respond_to do |format|
      format.json {render :json => Geocoder.search(search)}
    end
  end
  
  def location_counts
    @pre_users = PreUser.with_address
    respond_to do |format|
      format.js {render :layout => false}
    end
  end
end
