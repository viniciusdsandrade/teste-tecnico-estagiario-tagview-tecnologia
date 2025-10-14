# frozen_string_literal: true
# 
Rails.application.routes.draw do
  mount Rswag::Ui::Engine  => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  namespace :api do
    namespace :v1 do
      resources :produtos, controller: 'products', only: %i[index create] do
        collection { post :importacao }
      end
    end
  end

  # Qualquer outra rota -> 404 plain (frontend exigirá isso; aqui respondemos JSON)
  match '*unmatched', to: proc {
 [404, { 'Content-Type' => 'application/json' }, [{ erro: 'Oooops. Essa página não existe.' }.to_json]] }, via: :all
end
