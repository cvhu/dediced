Dediced::Application.routes.draw do
  
  
  resources :pre_users, :users, :sessions, :yums, :comments, :notifications, :tags, :imgs, :elites
  
  get "locations/index"

  get "locations/show"

  get "new_yum" => "Yums#new", :as => "new_yum"
  get "location_counts" => "Locations#location_counts", :as => "location_counts"
  
  # get "subscribe_validation" => "PreUsers#validation", :as => "subscribe_validation"  
  match "u/:user_name" => "Users#show"
  
  match "check_user_by_email" => "Users#checkEmails", :as => "check_user_by_email"
  match "check_user_by_name" => "Users#checkNames"
  match "search_pre_user_by_email" => "PreUsers#search", :as => "search_pre_user_by_email"

  
  # match "subscribe" => "PreUsers#new", :as => "subscribe"
  match "/invite/:pre_user_id" => "PreUsers#invite", :as => "invite"
  match "/forgot_password" => "Users#forgotPassword", :as => "forgot_password"
  match "/reset_password/:token" => "Users#resetPassword", :as => "reset_password"
  
  match "add_new" => "Yums#addNew", :as => "add_new"

  match "yum_comments/:yum_id" => "Comments#new", :as => "yum_comments"
  match "log_in_mobile" => "Sessions#create_mobile", :as => "log_in_mobile"
  match "/select_image/:id" => "Imgs#select_image", :as => "select_image"
  # match "/feedcss/:id/:dimension" => "Imgs#feedcss", :as => "feedcss"
  match "/viewed_notifications" => "Notifications#viewed_all", :as => "viewed_notifications"
  match "/clean_notifications" => "Notifications#destroy_all", :as => "clean_notifications"
  # match "/locations/:address" => "Locations#show", :as => "show_locations"
  # match "/locations" => "Locations#index", :as => "locations"
  match "/geosearch" => "Locations#search", :as => "geosearch"
  
  
  
  match "/shake" => "Yums#shake", :as => "shake"
  
  # JSON requests
  
  match "cdhttp" => "Yums#crossDomainHTTP"
  
  
  match "loggedIn" => "Users#loggedIn"
  
  
  match "user_by_id/:id/:size" => "Users#show"
  
  
  match "create_preuser" => "PreUsers#createPreUser"
  
  
  match "yum_by_id/:yum_id" => "Yums#getById"
  match "yums_search" => "Yums#getBySearch"
  match "yum_names_search/:q" => "Yums#getNamesBySearch"
  match "yums_shake" => "Yums#shake"
  match "shake/latest" => "Yums#shakeLatest"

  match "create_yum" => "Yums#createYum"
  match "destroy_yum" => "Yums#destroy"
  match "update_yum" => "Yums#update"
  
  match "create_rating" => "Ratings#new"
  
  match "create_comment_rating" => "CommentRatings#new"

  match "comments_by_yum_id/:yum_id" => "Comments#getByYumId"
  match "create_comment" => "Comments#createComment"
  
  match "/area/:tag_name/top_users" => "Tags#topUsers"
  match "/area/:tag_name/related_tags" => "Tags#relatedTags"
  
  match "/profile/:user_id/related_tags" => "Users#relatedTags"
  
  match "/send_reset_email" => "Users#sendResetEmail"
  
  match "/send_feedback_email" => "Users#sendFeedbackEmail"
  
  match "/send_share_email" => "Users#sendShareEmail"
  
  
  #### statistics
  match "/user/interests" => "Users#interests"
  match "/user/interestsList" => "Users#interestsList"
  match "/user/authors" => "Users#authors"
  match "/user/authorsList" => "Users#authorsList"

  
  
  ## elites
  
  
  #### search
  match "area_names" => "Tags#names"
  
  # root
  
  root :to => "Pages#search"


  match "/new" => "Yums#new_test"
  
  
  ################## Dediced 2.0
  match '/api/users/signup' => 'users#signupAPI'
  match '/api/users/email_exists' => 'users#emailExistsAPI'
  match '/api/users/:token/create' => 'users#createAPI'
  
  ################## Dediced v0.7.0
  match "/@:user_name" => "Users#show", :as => "user_profile"
  match "/area/:tag_name" => "Tags#show", :as => "area"
  
  match "/p/:token" => "Yums#profile"
  
  
  match "/stream" => "Yums#stream", :as => "stream"
  match "/search" => "Pages#search", :as => "search"
  
  match "/sign_up" => "PreUsers#new"
  match "/sign_up/:token" => "Users#new", :as => "sign_up"  
  
  match "/api/pre_user/create" => "PreUsers#createAPI"
  
  get "/log_in" => "Sessions#new", :as => "log_in"
  get "/log_out" => "Sessions#destroy", :as => "log_out"

  get "pool" => "PreUsers#index", :as => "pool"
  
  get "/admin" => "Pages#admin"
  
  # Stream
  match "/api/stream/date" => "Yums#streamLatestAPI", :as => "stream_lastest"
  match "/api/stream/interest" => "Yums#streamInterestAPI", :as => "stream_interest"  
  
  # User Profile
  match "/api/yums_by_user/:user_id" => "Yums#getByUserAPI"
  match "/api/yums_by_user_ups/:user_id" => "Yums#getByUserUpsAPI"
  match "/api/user/strengths" => "Users#strengthsAPI"
  match "/api/user/:user_id/description" => "Users#descriptionAPI"
  
  # Area Profile
  match "/api/yums_by_tag/:name" => "Yums#getByTagAPI"
  match "/api/area/:name/top_contributors" => "Tags#contributorsAPI"
  match "/api/area/:name/related_areas" => "Tags#relatedAreasAPI"
  
  # Yum Profile
  match "/api/post" => "Yums#profileAPI"
  match "/api/area/interest" => "Tags#interestAPI"
  match "/api/area/authority" => "Tags#authorityAPI"
  
  match "/api/search" => "indexes#searchAPI"
  
  match "/api/keywords/search" => "indexes#keywordSearchAPI"
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
