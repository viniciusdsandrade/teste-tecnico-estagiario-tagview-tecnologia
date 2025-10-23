# frozen_string_literal: true
# 
Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  namespace :api do
    namespace :v1 do
      defaults format: :json do
        resources :produtos, controller: 'products', only: %i[index create] do
          collection { post :importacao }
        end
      end
    end
  end
end
