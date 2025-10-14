# app/controllers/application_controller.rb  (autenticação, delay, tratamento 500)
class ApplicationController < ActionController::API
  before_action :authenticate_api_key
  around_action :delay_response

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { erros: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  # Captura falhas inesperadas (DB down, etc.) -> 500
  rescue_from StandardError do |e|
    # Evita expor detalhes em produção; em dev/test, mantém mensagem
    Rails.logger.error("[500] #{e.class}: #{e.message}\n#{e.backtrace&.first(5)&.join("\n")}")
    render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
  end

  private

  def authenticate_api_key
    return if doc_path_whitelisted?(request.path)

    unless request.headers['X-API-KEY'] == 'tagview-desafio-2024'
      head :unauthorized
    end
  end

  def delay_response
    yield
    sleep 3 unless Rails.env.test? # antes de enviar a resposta
  end

  def doc_path_whitelisted?(path)
    path.start_with?('/api-docs') || path.start_with?('/swagger') || path == '/openapi.yaml'
  end
end
