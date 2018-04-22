const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

const routeMiddleware = (req, res, next) => {
  console.log('Middleware');

  const name = req.query.name;
  if (name !== undefined && name.length) {
    next();
  } else {
    res.redirect('/');
  }
};

app.post('/check', (req, res) => {
  const name = req.body.name;
  const birthday = req.body.birthday;
  const age = moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years');
  if (age > 18) {
    res.redirect(`/major?name=${name}`);
  } else {
    res.redirect(`/minor?name=${name}`);
  }
});

app.get('/major', routeMiddleware, (req, res) => {
  res.render('major', { name: req.query.name });
});

app.get('/minor', routeMiddleware, (req, res) => {
  res.render('minor', { name: req.query.name });
});

app.listen(3000);
