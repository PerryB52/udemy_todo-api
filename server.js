//https://perry1-todo-api.herokuapp.com/todos
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;

var todos = [];

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo api Root');
});

//GET Request /todos
app.get('/todos', function(req, res){
    res.json(todos); //todos array will be converted into json and sent back to caller
});

//GET individual todos GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10); //second argument is the base, change only if you use binary/hexa etc...
    var matchedTodo;

    //itearate over todos find the match
    todos.forEach(function (todo){
        if(todoId === todo.id){
            matchedTodo = todo;
        }
    });

    if(matchedTodo){
        res.json(matchedTodo);
    } else {
       res.status(404).send();
    }

});


// POST /Todos /1 more npm module needed (npm install body-parser@1.13.3 --save)
app.post('/todos', function(req, res){
    //currently this function receives the json inputed from postman and shows it in postman
    var body = req.body;

    //add id
    body.id = todoNextId++;
    //todoNextId++;

    //push
    todos.push(body);

    // //console.log('description: ' + body.description);
    res.json(body);
});


app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});

