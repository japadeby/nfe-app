# NFe-App

Este aplicativo tem como objetivo desenvolver um gerenciamento de gastos financeiros através da inserção do QR-Code das [Notas Fiscais Eletrônicas (NFe)](http://www.nfe.fazenda.gov.br/portal/principal.aspx).

A princípio este projeto está estruturado com o back-end usando [LoopBack](http://loopback.io) e o front-end com [angular.js](https://angularjs.org/) e [ionic](http://ionicframework.com/).

## Instalação e execução

Para execução do projeto é necesário obter:

- node.js
- couchdb

Após instalação dos requisitos listados é necessário obter o código com:

```
$ git clone https://github.com/ifpb/nfe-app.git
```

Pronto, agora antes de executar o projeto é necessário ativar o banco couchdb e criar um database com no nome `nfe`. Em seguida execute o comando no raiz do projeto:

**Geração provider auth adicionando um novo aplicativo no facebook https://developers.facebook.com/**

```
$ npm install
$ node .
```

Para que a aplicação possa exibir alguns dados inicialmente execute:

```
$ curl localhost:3000/crawler/25150945543915044120650010000292201118199306
$ curl localhost:3000/crawler/25151045543915044120650110000366421693686433
```

Por fim, para executar o front-end execute:

```
$ cd client
$ npm install bower ionic -g
$ bower install
$ ionic serve
```
