# OpenapiClient::ProdutoInput

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **nome** | **String** |  |  |
| **preco** | **Float** |  |  |
| **imagem** | **String** | Data URL base64 (png/jpg). Máx 2MB (≈2.6MB base64). | [optional] |
| **descricao** | **String** |  |  |

## Example

```ruby
require 'openapi_client'

instance = OpenapiClient::ProdutoInput.new(
  nome: Teclado Mecânico,
  preco: 199.9,
  imagem: null,
  descricao: Descrição longa o suficiente (≥30 chars) para passar na validação.
)
```

