# frozen_string_literal: true

require 'rswag/ui'
Rswag::Ui.configure do |c|
  if c.respond_to?(:openapi_endpoint)
    c.openapi_endpoint '/api-docs/v1/openapi.yaml', 'API V1 Docs'
  else
    c.swagger_endpoint '/api-docs/v1/openapi.yaml', 'API V1 Docs'
  end
end
