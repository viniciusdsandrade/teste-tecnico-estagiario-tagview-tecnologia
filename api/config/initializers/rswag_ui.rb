require 'rswag/ui'
Rswag::Ui.configure do |c|
  if c.respond_to?(:openapi_endpoint)
    c.openapi_endpoint '/api-docs/v1/openapi.yaml', 'API V1 Docs'
  else
    # fallback para versões antigas (< 2.12)
    c.swagger_endpoint '/api-docs/v1/openapi.yaml', 'API V1 Docs'
  end
end