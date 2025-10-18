# frozen_string_literal: true

require 'rack/cors'  # segurança extra contra NameError

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173', 'http://127.0.0.1:5173'
    resource '/api/*',
             headers: :any,
             methods: %i[get post put patch delete options],
             max_age: 600
  end
end