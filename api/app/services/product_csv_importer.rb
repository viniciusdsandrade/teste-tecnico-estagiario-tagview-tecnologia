# frozen_string_literal: true

require "csv"
require "bigdecimal"

class ProductCsvImporter
  Result = Struct.new(:errors, :created_count, keyword_init: true)

  def self.call(file) = new(file).call

  def initialize(file)
    @file = file
  end

  def call
    errors = []
    created = 0

    csv_opts = {
      headers: true,
      return_headers: false,
      header_converters: [->(h) { h.to_s.strip.downcase }],
      encoding: "bom|utf-8"
    }

    ActiveRecord::Base.transaction do
      io = @file.tempfile
      io.rewind
      csv = CSV.new(io, **csv_opts)

      line_no = 1
      csv.each do |row|
        line_no += 1
        attrs = row_to_attrs(row)
        prod = Product.new(attrs)
        unless prod.valid?
          errors << "Linha #{line_no}: #{prod.errors.full_messages.join('; ')}"
        end
      end
      raise ActiveRecord::Rollback if errors.any?
    end

    if errors.empty?
      ActiveRecord::Base.transaction do
        io2 = @file.tempfile
        io2.rewind
        csv2 = CSV.new(io2, **csv_opts)

        csv2.each do |row|
          Product.create!(row_to_attrs(row))
          created += 1
        end
      end
    end
    Result.new(errors: errors, created_count: created)
  rescue CSV::MalformedCSVError => e
    Result.new(errors: ["CSV malformado: #{e.message}"], created_count: 0)
  end

  private

  def row_to_attrs(row)
    h = row.to_h
    {
      nome: blank_to_nil(h["nome"]),
      preco: parse_price(h["preco"]),
      imagem: blank_to_nil(h["imagem"]),
      descricao: blank_to_nil(normalize_text(h["descricao"]))
    }
  end

  def blank_to_nil(v)
    s = v.is_a?(String) ? v.strip : v
    s.present? ? s : nil
  end

  def parse_price(v)
    s = v.to_s.strip
    return nil if s.empty?
    s = s.gsub(/[^\d,.\-]/, "")
    s = s.tr(",", ".") if s.count(",") == 1 && s.rindex(",") > s.rindex(".").to_i
    BigDecimal(s)
  end

  def normalize_text(v)
    v.to_s.gsub(/\s+/, " ").strip
  end
end
