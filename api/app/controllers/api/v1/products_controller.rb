# app/controllers/api/v1/products_controller.rb
# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      require 'csv'

      # GET /api/v1/produtos
      def index
        per_page = normalized_limit(params[:limit])
        page     = params[:page].to_i <= 0 ? 1 : params[:page].to_i

        scope = Product.order(created_at: :desc)
        scope = scope.limit(per_page).offset((page - 1) * per_page) unless per_page == :all

        render json: scope.map { |p| product_json(p) }, status: :ok
      rescue StandardError => e
        Rails.logger.error(e.full_message)
        render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
      end

      # POST /api/v1/produtos
      def create
        product = Product.new(permitted_params)
        if product.save
          render json: product_json(product), status: :ok
        else
          render json: { erros: product.errors.full_messages }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error(e.full_message)
        render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
      end

      # POST /api/v1/produtos/importacao (multipart/form-data com campo "file")
      def importacao
        file = params[:file]
        return render json: { erros: ['Arquivo não enviado'] }, status: :bad_request unless file
        return render json: { erros: ['Arquivo recebido não é CSV'] }, status: :bad_request unless csv_file?(file)
        if file.size.to_i > 10 * 1024 * 1024
          return render json: { erros: ['Arquivo maior do que 10Mb'] }, status: :bad_request
        end

        result = ProductCsvImporter.call(file)

        if result.errors.any?
          render json: { erros: result.errors }, status: :unprocessable_entity
        else
          head :ok
        end
      rescue StandardError => e
        Rails.logger.error(e.full_message)
        render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
      end

      private

      # Strong Parameters (aceita corpo plano {nome, preco, imagem, descricao})
      def permitted_params
        params.permit(:nome, :preco, :imagem, :descricao)
      end

      def product_json(p)
        {
          id: p.uuid,
          nome: p.nome,
          preco: p.preco.to_f,
          imagem: p.imagem,
          descricao: p.descricao
        }
      end

      def normalized_limit(raw)
        return 10 if raw.blank?

        str = raw.to_s.downcase
        return :all if %w[all todos].include?(str)

        val = str.to_i
        return 10 unless [10, 20, 50].include?(val)

        val
      end

      def csv_file?(uploaded)
        ext_ok      = File.extname(uploaded.original_filename.to_s).downcase == '.csv'
        ctype       = uploaded.content_type.to_s
        content_ok  = ctype.include?('csv') || ctype.include?('excel') # ex: text/csv ou application/vnd.ms-excel
        ext_ok || content_ok
      end
    end
  end
end
