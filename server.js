//https://perry1-todo-api.herokuapp.com/todos
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //usualy people set underscore like this
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
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(matchedTodo){
        res.json(matchedTodo);
    } else {
       res.status(404).send();
    }

});


// POST /Todos /1 more npm module needed (npm install body-parser@1.13.3 --save)
app.post('/todos', function(req, res){
    //currently this function receives the json inputed from postman and shows it in postman
    var body = _.pick(req.body, 'description', 'completed'); //user _.pick to only pic description and completed

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){

        return res.status(404).send();
    }

    //set body.description to trimmed value
    body.description = body.description.trim();

    //add id
    body.id = todoNextId++;
    //todoNextId++;

    //push
    todos.push(body);

    // //console.log('description: ' + body.description);
    res.json(body);
});

//DELETE  /todos/:id - delete http method - deletes
app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(!matchedTodo){
        res.status(404).send({"error": "No todo found with that id"});
    } else {

        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }

});


// PUT=update // PUT /todos/:id
app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if(!matchedTodo){
        return res.status(400).send();
    }

    //first if runs = property exists and it is a boolean
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')){
        // bad = property existsbut it is not a boolean
        return res.status(400).send();
    } else {
        //Never provided attribute, no problem here
    }

        //first if runs = property exists and it is a boolean
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')){
        // bad = property existsbut it is not a boolean
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes); // updates matchedTodo //no need to update the array as in javascript arrays hold reffrences to objects

    res.json(matchedTodo);


});


app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});

