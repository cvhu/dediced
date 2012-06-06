class ElitesController < ApplicationController
  def index
    @user_elites = {}
    User.all.each do |user|
      @user_elites[user.id] = user.a_score
    end
    @user_elites_sorted = @user_elites.sort{|a,b| -1*(a[1]<=>b[1])}
    @area_elites = {}
    Tag.all.each do |area|
      @area_elites[area.id] = area.a_score
    end
    @area_elites_sorted = @area_elites.sort{|a,b| -1*(a[1]<=>b[1])}
    
  end
end
