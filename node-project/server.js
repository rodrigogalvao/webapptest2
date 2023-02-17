const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'redis',
  port: 6379
});
app.use(bodyParser.urlencoded({ extended: true }));
#version 2
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Formulário</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <style>
        body {
          background-color: #f2f2f2;
       
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