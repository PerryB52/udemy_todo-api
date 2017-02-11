var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
},
{
    id: 2,
    description: 'Go to market',
    completed: false
},
{
    id: 3,
    description: 'Feed the cat',
    completed: true
}
];

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

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});

