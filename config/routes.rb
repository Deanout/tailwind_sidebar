Rails.application.routes.draw do
  get 'pages/home'
  root 'pages#home'

  resources :posts
  resources :categories
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
