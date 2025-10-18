# frozen_string_literal: true

class ProductCsvImporter
  Result = Struct.new(:errors)

  def self.call(file) = new(file).call

  def initialize(file)
    @file = file
  end

  def call
    errors = []

    # Normaliza cabeçalhos (downcase + strip) e lê como tabela
    csv_opts = {
      headers: true,
      return_headers: false,
      header_converters: [->(h) { h.to_s.strip.downcase }]
    }

    ActiveRecord::Base.transaction do
      line_no = 1
      csv = CSV.new(@file.tempfile, **csv_opts)

      csv.each do |row|
        line_no += 1
        attrs   = row_to_attrs(row)
        prod    = Product.new(attrs)

        unless prod.valid?
          errors << "Erro na linha #{line_no}: #{prod.errors.attribute_names.map(&:to_s).join(', ')}"
        end
      end

      raise ActiveRecord::Rollback if errors.any?

      # Persistência: rebobina o IO e cria de fato
      @file.tempfile.rewind
      csv2 = CSV.new(@file.tempfile, **csv_opts)
      csv2.each { |row| Product.create!(row_to_attrs(row)) }
    end

    Result.new(errors)
  rescue CSV::MalformedCSVError => e
    Result.new(["CSV malformado: #{e.message}"])
  end

  private

  def row_to_attrs(row)
    h = row.to_h
    {
      nome: blank_to_nil(h['nome']),
      preco: h['preco'].to_f,
      imagem: blank_to_nil(h['imagem']),
      descricao: blank_to_nil(h['descricao'])
    }
  end

  def blank_to_nil(v)
    s = v.is_a?(String) ? v.strip : v
    s.present? ? s : nil
  end
end
