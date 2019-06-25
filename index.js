const express = require('express'); // Importa os dados da dependência

const server = express(); // cria uma variável e atribui a ela a função do express

server.use(express.json()); // Diz para o express que será retornado da requisição json

/* Existem 3 formas de enviar parâmetros pelas requisições:
Query Params = ?teste=1

Ex: server.get("/teste", (req, res) => {
  const nome = req.query.name;

  return res.json({ message: `Hello ${nome}` });
});

Route Params = /users/1 (passsa um id de resposta)

Ex: server.get("/users/:id", (req, res) => {
  const id = req.params.id;

  return res.json({ message: `Buscando o usuário ${id}` });
});

Request Params = { "name": "Yago", "email": "teste@gmail.com" }
*/

const users = ['Yago', 'Lucas', 'Erivelton'];

// Middleware Global

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

// Middleware Local

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function CheckUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  return next();
}

// CRUD - Create, Read, Update, Delete

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', CheckUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body; // Quebra o corpo da resposta da requisição e pega a tag name

  users.push(name); // Inseri um novo index no array

  return res.json(users);
});

// Altera um dado

server.put('/users/:index', checkUserExists, CheckUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);

  
});

server.delete('/users/:index', CheckUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

/* Acima cria-se uma nova requisição tipo get, em que o primeiro parâmetro da função é a rota, e o segundo uma função
com dois parâmetros padrão: req e res
req => representa todos os dados da requisição
res => representa a resposta que damos ao front-end com esta requisição

*/

server.listen(3000);
