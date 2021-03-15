const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  // Complete aqui
  const { username } = req.headers;

  const user = users.find(user => user.username === username);

  if(!user){
    return res.status(400).json({ error : "Non-existent user"});
  }

  req.user = user;

  return next();
}

app.get('/users', (req, res) =>{
  return res.json(users)
});

app.post('/users', (req, res) => {
  // Complete aqui
  const { name, username } = req.body;

  const checkUserExists = users.some((user) => user.username == username);

  if(checkUserExists){
    return res.status(400).json({ error : "Username already exists"});
  }

  const user = {
    username,
    name,
    id: uuidv4(),
    todos: []
  }

  users.push(user);

  return res.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;

  return res.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { title, deadline } = req.body;

  const createTodo = {
    id : uuidv4(),
    title,
    deadline : new Date(deadline),
    done: false,
    created_at : new Date()
  }

  user.todos.push(createTodo);

  return res.status(201).json(createTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return res.status(404).json({ error : 'Todo not exists'})
  }

  todo.title = title
  todo.deadline = new Date(deadline)

    return res.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return res.status(404).json({ error : 'Todo not exists'})
  }

  todo.done = true;

    return res.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;

  const todoPosition = user.todos.findIndex(todo => todo.id === id);

  if(todoPosition === -1){
    return res.status(404).json({ error : 'Todo not exists'})
  }

  user.todos.splice(todoPosition, 1)

    return res.status(204).json();
});

module.exports = app;