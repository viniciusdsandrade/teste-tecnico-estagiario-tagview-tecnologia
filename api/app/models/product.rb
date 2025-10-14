# app/models/product.rb
require 'securerandom'
require 'base64'

class Product < ApplicationRecord
  before_validation :ensure_uuid

  validates :nome, presence: true, length: { in: 3..50 }
  validates :preco, presence: true, numericality: { greater_than_or_equal_to: 10 }
  validates :descricao, presence: true, length: { in: 30..255 }
  validate :validate_imagem_if_present

  private

  def ensure_uuid
    self.uuid ||= SecureRandom.uuid
  end

  def validate_imagem_if_present
    return if imagem.blank?
    unless imagem.start_with?('data:image/png;base64,') || imagem.start_with?('data:image/jpeg;base64,')
      errors.add(:imagem, 'deve ser PNG ou JPG codificado em data URL base64'); return
    end
    base64 = imagem.split(',', 2)[1].to_s
    size_bytes = (base64.length * 3) / 4
    errors.add(:imagem, 'maior que 2MB') if size_bytes > 2.megabytes
  end
end


