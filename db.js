//server.js will request connection from db.js - db will return it and server will use
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var sequelize;

//proces = global object that provides info over the current node.js process - has stored multiple other objects and constants etc...
// sequelize will be set differently depending on what environment i am running (local vs heroku)
if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}



var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js')
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;