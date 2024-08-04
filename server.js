const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Todo = mongoose.model('Todo', new mongoose.Schema({
  title: String,
  completed: Boolean,
}));

// API endpoints
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: false,
  });
  await todo.save();
  res.send(todo);
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.title = req.body.title;
  todo.completed = req.body.completed;
  await todo.save();
  res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.send({ message: 'Todo deleted' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
