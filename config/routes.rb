Rails.application.routes.draw do
  resources :comments
  resources :articles
  resources :users
  resources :user_sessions, only: [:new, :create, :destroy]

  namespace :api do
    namespace :v1 do
      resources :users
      resources :user_sessions, only: [:new, :create, :destroy]
    end
  end

  ### named routes be here
  get 'register' => "users#new",           as: :register
  get 'login' => "user_sessions#new",      as: :login
  get 'logout' => "user_sessions#destroy", as: :logout

  # root
  root :to => 'users#index'
end
