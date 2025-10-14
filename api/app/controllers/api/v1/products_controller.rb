module Api
  module V1
    class ProductsController < ApplicationController
      require 'csv'

      # GET /api/v1/produtos
      def index
        per_page = normalized_limit(params[:limit]) # 10/20/50/:all
        page = params[:page].to_i <= 0 ? 1 : params[:page].to_i

        scope = Product.order(created_at: :desc)
        scope = scope.limit(per_page).offset((page - 1) * per_page) unless per_page == :all

        render json: scope.map { |p| product_json(p) }, status: :ok
      rescue => e
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
      rescue => e
        Rails.logger.error(e.full_message)
        render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
      end

      # POST /api/v1/produtos/importacao (multipart/form-data com "file")
      def importacao
        file = params[:file]
        return render json: { erros: ['Arquivo não enviado'] }, status: :bad_request unless file

        unless csv_file?(file)
          return render json: { erros: ['Arquivo recebido não é CSV'] }, status: :bad_request
        end
        if file.size.to_i > 10 * 1024 * 1024
          return render json: { erros: ['Arquivo maior do que 10Mb'] }, status: :bad_request
        end

        errors = []
        line_no = 1
        csv = CSV.new(file.tempfile, headers: true, return_headers: false)

        ActiveRecord::Base.transaction do
          csv.each do |row|
            line_no += 1
            attrs = normalize_csv_row(row)
            product = Product.new(attrs)
            unless product.valid?
              errors << "Erro na linha #{line_no}: #{product.errors.attribute_names.map(&:to_s).join(', ')}"
            end
          end
          raise ActiveRecord::Rollback if errors.present?

          file.tempfile.rewind
          csv2 = CSV.new(file.tempfile, headers: true, return_headers: false)
          csv2.each { |row| Product.create!(normalize_csv_row(row)) }
        end

        return render json: { erros: errors }, status: :unprocessable_entity if errors.present?
        head :ok
      rescue => e
        Rails.logger.error(e.full_message)
        render json: { erros: ['Erro interno no servidor'] }, status: :internal_server_error
      end

      private

      # Strong Parameters — aceita sem raiz (top-level). Se você QUISER exigir raiz, troque por:
      # params.require(:produto).permit(:nome, :preco, :imagem, :descricao)
      # (wrap_parameters permite trabalhar sem raiz para JSON). :contentReference[oaicite:3]{index=3}
      def permitted_params
        params.permit(:nome, :preco, :imagem, :descricao)
      end

      def product_json(p)
        {
          id: p.uuid, # o teste quer id = uuid
          nome: p.nome,
          preco: p.preco.to_f, # retorna como number
          imagem: p.imagem,
          descricao: p.descricao
        }
      end

      def normalized_limit(raw)
        return 10 if raw.blank?
        str = raw.to_s.downcase
        return :all if str == 'all' || str == 'todos'
        val = str.to_i
        return 10 unless [10, 20, 50].include?(val)
        val
      end

      def csv_file?(uploaded)
        filename_ok = File.extname(uploaded.original_filename.to_s).downcase == '.csv'
        content_ok = uploaded.content_type.to_s.include?('csv') || uploaded.content_type.to_s.include?('excel')
        filename_ok || content_ok
      end

      def normalize_csv_row(row)
        h = row.to_h.transform_keys { |k| k.to_s.strip.downcase }
        {
          nome: h['nome'],
          preco: h['preco'].to_f,
          imagem: h['imagem'].presence,
          descricao: h['descricao']
        }
      end
    end
  end
end
