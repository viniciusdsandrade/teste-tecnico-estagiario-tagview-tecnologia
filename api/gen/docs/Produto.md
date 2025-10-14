# OpenapiClient::Produto

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **id** | **String** |  |  |
| **nome** | **String** |  |  |
| **preco** | **Float** |  |  |
| **imagem** | **String** | Data URL base64 (png/jpg). Ex.: data:image/png;base64,.... | [optional] |
| **descricao** | **String** |  |  |

## Example

```ruby
require 'openapi_client'

instance = OpenapiClient::Produto.new(
  id: null,
  nome: Teclado Mecânico,
  preco: 199.9,
  imagem: null,
  descricao: Teclado com switches táteis; excelente para produtividade.
)
```

