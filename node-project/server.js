const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
  
  <!DOCTYPE html>
  <html>
    <head>
      <title>Formulário - version 2.0</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <style>
        body {
          background-color: #f2f2f2;
        }
        h1 {
          text-align: center;
          margin-top: 50px;
          color: #3b5998;
          font-size: 48px;
          font-weight: bold;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        label {
          color: #3b5998;
          font-weight: bold;
        }
        input {
          border-radius: 10px;
          border: none;
          padding: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .btn-primary {
          background-color: #3b5998;
          border-color: #3b5998;
          border-radius: 10px;
          font-weight: bold;
          width: 100%;
          margin-top: 20px;
        }
        .btn-primary:hover {
          background-color: #2d4373;
          border-color: #2d4373;
        }
        .image-container {
          text-align: center;
          margin-bottom: 50px;
        }
        .image-container img {
          max-width: 150px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="image-container">
        </div>
        <h1>Formulário - version 3.0</h1>
        <form action="/" method="post">
          <div class="form-group">
            <label for="inputNome">Nome:</label>
            <input type="text" class="form-control" id="inputNome" name="nome" placeholder="Digite seu nome">
          </div>
          <div class="form-group">
            <label for="inputSobrenome">Sobrenome:</label>
            <input type="text" class="form-control" id="inputSobrenome" name="sobrenome" placeholder="Digite seu sobrenome">
          </div>
          <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
      </div>
    </body>
  </html>
  `);
});

app.post('/', (req, res) => {
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  client.rpush('nomes', `${nome} ${sobrenome}`, (err, reply) => {
    if (err) {
      console.error(err);
      return res.send('Ocorreu um erro ao armazenar os dados.');
    }
    console.log(`Nome ${nome} ${sobrenome} armazenado com sucesso.`);
    res.send('Dados armazenados com sucesso!');
  });
});

app.get('/consulta', (req, res) => {
  client.lrange('nomes', 0, -1, (err, nomes) => {
    if (err) {
      console.error(err);
      return res.send('Ocorreu um erro ao consultar os dados.');
    }
    const listaNomes = nomes.map(nome => `<li>${nome}</li>`).join('');
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Consulta</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <style>
          body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
          }
          .container {
            margin-top: 50px;
            padding: 20px;
            border-radius: 10px;
            background-color: white;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #343a40;
            text-align: center;
            margin-bottom: 30px;
          }
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          li {
            background-color: #e9ecef;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
          }
          li:hover {
            background-color: #ced4da;
            cursor: pointer;
          }
          a {
            color: #343a40;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Consulta</h1>
          <ul>
            ${listaNomes}
          </ul>
        </div>
      </body>
    </html>
    `;
    res.send(html);
  });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Aplicação rodando na porta 8080.');
});