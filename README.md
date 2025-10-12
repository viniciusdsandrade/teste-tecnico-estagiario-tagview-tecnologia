
# TagProducts - Teste para Desenvolvedor FullStack da Tagview

Olá, bem vindo(a)!

Esse é um teste técnico tendo em vista a posição de "Desenvolvedor FullStack" na Tagview.

Você deverá desenvolver uma API REST (conectada a um banco de dados) e uma aplicação web que consumirá a API e será o frontend da aplicação. Ambos os projetos devem ficar em um mesmo repositório Git, com a estrutura indicada na seção Docker.

⚠️ Recomendamos que você evite o uso de IA durante o desenvolvimento, pois esperamos que você tenha um grande nível de compreensão de seu próprio código e haverá uma entrevista técnica onde seu código será avaliado.


Para ajudar sua organização (nossa avaliação e bate-papo posteriores), dividimos em alguns tópicos:

- Frontend
- Backend
- Banco de Dados
- Docker e Monorepo

## Frontend

Teremos 2 rotas nesse projeto:

### `/produtos/exibir`

Exibirá os produtos cadastrados em nosso sistema em formato de "Cards", cada
card contendo:


- Imagem do produto ou fallback caso não haja imagem cadastrada
- Nome do Produto
- Preço do Produto


Essa lista será limitada a 10 produtos exibidos de cada vez e você deverá
implementar um sistema de paginação.


É possível alterar o limite de produtos sendo exibidos na página para
20, 50 ou Todos.


Ao clicar em um card, um modal deve ser exibido com os dados do card, mas
adicionando a descrição completa do produto.


Essa página também deverá aceitar um "query param" `idProduto` com o
código do produto cadastro. Caso seja acessada diretamente com o query
param na URL, nada muda na feature de listagem, mas o modal deverá
iniciar aberto no produto solicitado.


### `/produtos/cadastro`

Essa página irá conter um formulário para o cadastro de produtos, serão cadastrados:

- Nome do Produto
- Preço do Produto (em Reais)
- Descrição Completa
- Imagem (opcional)

O formulário deverá ser validado antes de enviado com as seguintes regras:
- Nome do Produto: mínimo de 3 caracteres, máximo 50, obrigatório.
- Preço do Produto: mínimo numérico de 10, máximo indefinido, obrigatório.
- Descrição Completa: mínimo de 30 caracteres, máximo de 255, obrigatório.
- Imagem: png ou jpg, máximo de 5MB, opcional.

A validação de frontend ocorrerá somente no momento de tentativa de submissão.

No caso de erro no backend (também teremos validação por lá), o erro
deve ser exibido no formulário.

No caso de sucesso no envio, o usuário deverá ser redirecionado para
`/produtos/exibir?idProduto=NOVO_ID_CADASTRADO`, onde
NOVO_ID_CADASTRADO foi retornado pela API e uma mensagem (a sua
escolha) será exibida com os dizeres: "Novo Produto Cadastrado!".


### Requisitos
- Você pode utilizar qualquer framework javascript para essa tarefa, nós
preferimos React, mas pode ser Vue, Angular, SolidJS, ou mesmo JS
Vanilla.

- Você pode utilizar qualquer biblioteca de componentes e estilização, algumas bibliotecas que já utilizamos em projetos são Material UI,  Chakra UI e Tailwind CSS, mas pode utilizar outra de sua escolha.

- O Design fica por sua conta, busque ser criativo e prezar por uma boa usabilidade. Como sugestão, pode utilizar o Figma ou outra ferramenta para primeiro prototipar um design a ser implementado, se sentir confortável.

- Nós utilizamos Typescript na maioria dos projetos de Frontend, mas
fique à vontade para usar Javascript puro.

- Qualquer outra url deverá retornar uma página com os dizeres:
"Oooops. Essa página não existe."

- As solicitações para a API devem conter o cabeçalho X-API-KEY com o
valor "tagview-desafio-2024".

- Configure ferramentas de formatação e linting para ajudar no
desenvolvimento do app.


## Backend

Endpoints da nossa api:

### Listagem de produtos - GET `/api/v1/produtos`
Acessado com o método GET, listará os produtos cadastrados, retornará
um JSON no formato:

```json
[
  {
    "id": uuid,
	"nome": string,
	"preco": number,
	"imagem": string | null,
	"descricao": string,
  },
  ...
]
```

No caso de nenhum produto cadastrado, retorna um array JSON vazio.


### Criação de produto - POST `/api/v1/produtos`

Acessado com o método POST enviando um corpo JSON no formato:
```json
{
  "nome": string,
  "preco": number,
  "imagem": string | null,
  "descricao": string,
}
```

Todos os campos deverão ser validados de acordo com os requisitos
solicitados na etapa de Frontend, com uma exceção:

Aqui nós vamos limitar o tamanho da imagem para 2MB, só para forçar
um erro que será enviado ao frontend em um teste ponta à ponta.

No caso de erro em qualquer validação, deverá ser devolvido ao cliente
uma mensagem com status code 422:

```json
{
  "erros": ["erro 1", "erro 2", "erro 3"],
}
```

No caso de sucesso o retorno será com o status code 200 e o corpo:
```json
{
  "id": uuid,
  "nome": string,
  "preco": number,
  "imagem": string | null,
  "descricao": string,
}
```

Não há restrições para cadastros de produtos "repetidos".


### (Opcional) Importação de produtos via CSV - POST `/api/v1/produtos/importacao`

Esse endpoint não será consumido pelo frontend, mas via um client HTTP como curl, Postman ou Insomnia.

Deverá receber um POST um arquivo .csv de no máximo 10MB.

No caso de um arquivo maior e/ou de formato inválido, você deverá
enviar uma resposta com status code 400 e um JSON:

```json
{
  "erros": ["Arquivo maior do que 10Mb", "Arquivo recebido não é CSV"]
}
```

O arquivo irá conter linhas no formato:

```csv
nome, preco, imagem, descricao
Produto1, 2000, data:image/jpeg;base64... , Um produto super eficiente para você desenvolvedor
Produto2, 3000, data:image/jpeg;base64... , Esse teclado mecânico vai revolucionar sua produtividade
"Produto 3", 4000, data:image/jpeg;base64... , Um produto com nome composto
"Produto ""4"", 4000, data:image/jpeg;base64... , Um produto com aspas duplas
```

A primeira linha sempre será o cabeçalho e poderá vir em ordens
diferente da proposta acima.

A validação dos dados será a mesma do endpoint `/api/v1/produtos` (imagem é opcional).

No caso de erros no processamento das linhas, você deverá enviar uma resposta com
status code 422 e um JSON:

```json
{
  "erros": ["Erro na linha 2: nome", "Erro na linha 10: nome, imagem", ...]
}
```

No caso de sucesso da validação e cadastro no banco, retornar o status
code 200 sem corpo.


### Requisitos

- Na Tagview nós usamos Ruby on Rails como framework preferido de
backend. Você definitivamente irá trabalhar com essa tecnologia, então
seria muito bom fazer o desafio com esse framework (conta pontos). Mas
para o desafio também aceitaremos outras tecnologias no backend, seja
em Node, Java, Python, Rust, etc (com ou sem frameworks e bibliotecas de
cada tecnologia).

- Inclua um delay de 3 segundos antes do retorno de cada requisição,
queremos ver como o frontend se comporta enquanto aguarda a conclusão
da requisição.

- Faça um SWAGGER da sua api ou outra forma de documentação análoga.
Se possível, implemente um processo que gere a documentação de forma
automatizada.

- Os requests para essa api deverão conter o cabeçalho X-API-KEY com o
valor "tagview-desafio-2024", caso contrário, retorne 401 sem corpo.

- Erros genéricos na API e/ou perda de conexão com o banco devem
retornar status code 500.

- Para fins de simplificação, você pode passar e retornar imagens da API codificadas como uma string base64. Também pode guardar as imagens no banco de dados.


## Banco de Dados

- Você deverá criar uma tabela com as colunas solicitadas nos passos
anteriores, adicionando a data de criação, a última data de modificação
e demais campos que julgar necessário.

- Utilize um DBMS Relacional (SQL), não serão aceitos para o desafio
DBMSs NOSQL e SQLite. Nós preferimos MySQL e PostgreSQL.


## Docker e MonoRepo

Aqui na Tagview nós amamos Docker! Isso garante que o que funciona na
máquina de um programador, também funcione na máquina dos demais e em
produção.

Seu projeto deve ser estruturado na seguinte árvore em um único
repositório com versionamento controlado por GIT:

```shell
README.md
docker-compose.yml
...(Demais arquivos/diretórios que você julgue necessário)

api/
   Dockerfile
   swagger/
   ...(Projeto de Backend)
client/
   Dockerfile
   ...(Projeto de Frontend)
```

Configure os apps para funcionarem em modo "produção" quando buildados
pelo Dockerfile.

Utilizando `docker-compose build` e `docker-compose up` esperamos
subir o app e testá-lo, acessando o frontend pela porta 3000 e backend
pela porta 4000.


### Considerações finais

- Utilize git para o versionamento do projeto e evite commits com muitas alterações.
Nós gostamos de ver um git log que conta uma história e não um commit único com tudo pronto. Claro que, se você utilizar branches diferentes que são mergeadas na master, não tem problema a master ficar com poucos commits.

- Faça grande uso de frameworks e bibliotecas no projeto para minimizar seu trabalho e aumentar sua produtividade. Não esperamos que alguém implemente as funcionalidades do zero. Busque utilizar bibliotecas bem estabelecidas na comunidade e sendo mantidas até hoje.

- Não fique pensando em "comitar" somente o que deu certo, se precisar
refatorar, alterar alguma coisa, é até melhor termos um histórico,
isso ajuda a mostrar a forma como você pensa e como resolve os
problemas.

- A stack utilizada no projeto de nossa empresa é Ruby on Rails + React +
MySQL. Se possível, utilize essa stack, caso contrário, pode utilizar tecnologias com as quais se sente confortável.

- Suba seu código em um repositório público no Github, Gitlab ou site
git preferido e nos envie o link, não esqueça de deixar o acesso público!

- Opcionalmente, faça deploy de sua aplicação na nuvem, isso é, faça deploy do frontend e do backend e deixe a aplicação publicamente acessível na Internet. Para isso você pode utilizar os serviços que conhecer, alguns muito usados são: Netlify, Vercel e Heroku (no entanto o Heroku não tem mais um plano free).

- Utilize comentários onde e quando achar apropriado.

