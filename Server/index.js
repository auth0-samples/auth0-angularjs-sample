var fs = require('fs');
var path = require('path');
var express = require('express');
var jwt = require('express-jwt');
var bodyParser = require('body-parser');

var env = require('./env'); //See env.example for example

var app = express();

var authenticate = jwt({
  secret: new Buffer(env.CLIENT_SECRET, 'base64'),
  audience: env.CLIENT_ID
});

var TODO_STORE = path.join(__dirname, 'todo.json');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    // Handle CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Disable caching
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/todos', authenticate, function(req, res) {
  console.log(req.headers, req.user)
  fs.readFile(TODO_STORE, function(err, todos) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(todos));
  });
});


app.post('/api/todos', function(req, res) {

  fs.readFile(TODO_STORE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var todos = JSON.parse(data);

    var newTodo = {
      id: Date.now(),
      creator: req.body.creator,
      text: req.body.text,
    };

    todos.push(newTodo);
    fs.writeFile(TODO_STORE, JSON.stringify(todos, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(todos);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
