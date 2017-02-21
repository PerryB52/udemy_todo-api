//https://perry1-todo-api.herokuapp.com/todos
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //usualy people set underscore like this
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.send('Todo API Root');
});

//GET Request /todos //can get completed by using query params
app.get('/todos', function(req, res) {

    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {
            completed: true
        });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {
            completed: false
        });
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos); //todos array will be converted into json and sent back to caller
});

//GET individual todos GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10); //second argument is the base, change only if you use binary/hexa etc...

    db.todo.findById(todoId).then(function(todo){
        if(!!todo){
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e){
        res.status(500).send();
    });


    // var matchedTodo = _.findWhere(todos, {
    //     id: todoId
    // });

    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }

});


// POST /Todos /1 more npm module needed (npm install body-parser@1.13.3 --save)
app.post('/todos', function(req, res) {
    //currently this function receives the json inputed from postman and shows it in postman
    var body = _.pick(req.body, 'description', 'completed'); //user _.pick to only pic description and completed

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });

    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

    //     return res.status(404).send();
    // }

    // //set body.description to trimmed value
    // body.description = body.description.trim();

    // //add id
    // body.id = todoNextId++;
    // //todoNextId++;

    // //push
    // todos.push(body);

    // // //console.log('description: ' + body.description);
    // res.json(body);
});

//DELETE  /todos/:id - delete http method - deletes
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).send({
            "error": "No todo found with that id"
        });
    } else {

        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }

});


// PUT=update // PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(400).send();
    }

    //first if runs = property exists and it is a boolean
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        // bad = property existsbut it is not a boolean
        return res.status(400).send();
    } else {
        //Never provided attribute, no problem here
    }

    //first if runs = property exists and it is a boolean
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        // bad = property existsbut it is not a boolean
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes); // updates matchedTodo //no need to update the array as in javascript arrays hold reffrences to objects

    res.json(matchedTodo);


});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
})