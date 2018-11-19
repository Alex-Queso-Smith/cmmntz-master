Rails.application.routes.draw do
  if Rails.env.development?
    require 'sidekiq/web'
    mount Sidekiq::Web => '/sidekiq'
  end

  resources :comments
  resources :articles
  resources :users do
    member do
      get :edit_password
    end
  end
  resources :user_sessions, only: [:new, :create, :destroy]

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :create, :update, :destroy]
      resources :user_sessions, only: [:new, :create, :destroy]
      resources :comments, only: [:index, :show, :create, :update, :destroy]
      resources :comment_filters, only: [:create]
      resources :votes, only: [:create, :update, :destroy]
      resources :followings, only: [:create]
      resources :unfollowings, only: [:create]
      resources :blockings, only: [:create]
      resources :unblockings, only: [:create]

      # this only lives here temporarily
      resources :admin_mails, only: [:create]
    end
  end

  # temp routes
  resources :admin_mails, only: [:new]

  ### named routes be here
  get 'register' => "users#new",           as: :register
  get 'login' => "user_sessions#new",      as: :login
  get 'logout' => "user_sessions#destroy", as: :logout

  # root
  root :to => 'articles#index'
end
