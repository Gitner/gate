const express = require('express'),
      path    = require('path'),
      ctrl    = require('./control.js'),
      app     = express(),
      gate    = new ctrl();

//express middleware for serving static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/open', (req, res) => {
  //rimane nella pagina chiamante
  res.redirect('/');
  //chiamata al metodo apri
  gate.Open();
});

app.get('/close', (req, res) => {
  //rimane nella pagina chiamante
  res.redirect('/');
  //chiamata al metodo chiudi
  gate.Close();
});

app.listen(9090);

