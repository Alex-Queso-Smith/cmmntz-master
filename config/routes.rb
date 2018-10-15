Rails.application.routes.draw do
  resources :articles
  resources :users
  resources :user_sessions, only: [:new, :create, :destroy]

  namespace :api do
    namespace :v1 do
      resources :users
      resources :user_sessions, only: [:new, :create, :destroy]
    end
  end
end
