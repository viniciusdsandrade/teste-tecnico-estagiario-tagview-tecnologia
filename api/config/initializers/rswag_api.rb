# frozen_string_literal: true

require 'rswag/api'
Rswag::Api.configure do |c|
  c.openapi_root = Rails.root.join('swagger').to_s
end
