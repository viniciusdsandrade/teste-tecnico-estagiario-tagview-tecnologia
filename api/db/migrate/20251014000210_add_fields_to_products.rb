class AddFieldsToProducts < ActiveRecord::Migration[6.1]
  def change
    add_column :products, :nome,      :string,  null: false, limit: 50
    add_column :products, :preco,     :decimal, null: false, precision: 12, scale: 2
    # Para MySQL, :text com limit ~16MB vira MEDIUMTEXT (16,777,215 bytes)
    add_column :products, :imagem,    :text,    limit: 16.megabytes - 1
    add_column :products, :descricao, :string,  null: false, limit: 255
    add_column :products, :uuid,      :string,  null: false, limit: 36
    add_index  :products, :uuid, unique: true
  end
end
