Rails.application.routes.draw do
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
      resources :users, only: [:create, :update, :destroy]
      resources :user_sessions, only: [:new, :create, :destroy]
      resources :comments, only: [:index, :create, :update, :destroy]
      resources :comment_filters, only: [:create]
      resources :votes, only: [:create, :update, :destroy]
    end
  end

  ### named routes be here
  get 'register' => "users#new",           as: :register
  get 'login' => "user_sessions#new",      as: :login
  get 'logout' => "user_sessions#destroy", as: :logout

  # root
  root :to => 'users#index'
end
