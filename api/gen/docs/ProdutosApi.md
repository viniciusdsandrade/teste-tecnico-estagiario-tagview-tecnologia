# OpenapiClient::ProdutosApi

All URIs are relative to *http://localhost:4000*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**create_produto**](ProdutosApi.md#create_produto) | **POST** /api/v1/produtos | Criação de produto |
| [**import_produtos_csv**](ProdutosApi.md#import_produtos_csv) | **POST** /api/v1/produtos/importacao | Importação de produtos via CSV |
| [**list_produtos**](ProdutosApi.md#list_produtos) | **GET** /api/v1/produtos | Listagem de produtos |


## create_produto

> <Produto> create_produto(produto_input)

Criação de produto

### Examples

```ruby
require 'time'
require 'openapi_client'
# setup authorization
OpenapiClient.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['ApiKeyAuth'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['ApiKeyAuth'] = 'Bearer'
end

api_instance = OpenapiClient::ProdutosApi.new
produto_input = OpenapiClient::ProdutoInput.new({nome: 'Teclado Mecânico', preco: 199.9, descricao: 'Descrição longa o suficiente (≥30 chars) para passar na validação.'}) # ProdutoInput | 

begin
  # Criação de produto
  result = api_instance.create_produto(produto_input)
  p result
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->create_produto: #{e}"
end
```

#### Using the create_produto_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<Produto>, Integer, Hash)> create_produto_with_http_info(produto_input)

```ruby
begin
  # Criação de produto
  data, status_code, headers = api_instance.create_produto_with_http_info(produto_input)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <Produto>
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->create_produto_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **produto_input** | [**ProdutoInput**](ProdutoInput.md) |  |  |

### Return type

[**Produto**](Produto.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## import_produtos_csv

> import_produtos_csv(file)

Importação de produtos via CSV

Recebe arquivo .csv (até 10MB) com cabeçalho flexível. A validação é a mesma do POST /api/v1/produtos (imagem opcional). 

### Examples

```ruby
require 'time'
require 'openapi_client'
# setup authorization
OpenapiClient.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['ApiKeyAuth'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['ApiKeyAuth'] = 'Bearer'
end

api_instance = OpenapiClient::ProdutosApi.new
file = File.new('/path/to/some/file') # File | 

begin
  # Importação de produtos via CSV
  api_instance.import_produtos_csv(file)
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->import_produtos_csv: #{e}"
end
```

#### Using the import_produtos_csv_with_http_info variant

This returns an Array which contains the response data (`nil` in this case), status code and headers.

> <Array(nil, Integer, Hash)> import_produtos_csv_with_http_info(file)

```ruby
begin
  # Importação de produtos via CSV
  data, status_code, headers = api_instance.import_produtos_csv_with_http_info(file)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => nil
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->import_produtos_csv_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **file** | **File** |  |  |

### Return type

nil (empty response body)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json


## list_produtos

> <Array<Produto>> list_produtos(opts)

Listagem de produtos

### Examples

```ruby
require 'time'
require 'openapi_client'
# setup authorization
OpenapiClient.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['ApiKeyAuth'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['ApiKeyAuth'] = 'Bearer'
end

api_instance = OpenapiClient::ProdutosApi.new
opts = {
  page: 56, # Integer | Número da página (>= 1). Default 1.
  limit: 10 # Integer | Limite por página. `10`, `20`, `50` ou `0=Todos` (sem paginação).
}

begin
  # Listagem de produtos
  result = api_instance.list_produtos(opts)
  p result
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->list_produtos: #{e}"
end
```

#### Using the list_produtos_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<Array<Produto>>, Integer, Hash)> list_produtos_with_http_info(opts)

```ruby
begin
  # Listagem de produtos
  data, status_code, headers = api_instance.list_produtos_with_http_info(opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <Array<Produto>>
rescue OpenapiClient::ApiError => e
  puts "Error when calling ProdutosApi->list_produtos_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **page** | **Integer** | Número da página (&gt;&#x3D; 1). Default 1. | [optional][default to 1] |
| **limit** | **Integer** | Limite por página. &#x60;10&#x60;, &#x60;20&#x60;, &#x60;50&#x60; ou &#x60;0&#x3D;Todos&#x60; (sem paginação). | [optional][default to 10] |

### Return type

[**Array&lt;Produto&gt;**](Produto.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

