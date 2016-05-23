var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var TODO_STORE = path.join(__dirname, 'todo.json');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    // Handle CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Disable caching
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/todos', function(req, res) {
  console.log(req.headers)
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
