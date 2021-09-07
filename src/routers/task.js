const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

// Create Tasks   POST /tasks
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get All Tasks for User  GET /tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate('tasks');
    console.log(req.user.tasks);
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get All Tasks   GET /tasks/:id
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Update Task by ID   PATCH /tasks/:id
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Operation' });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete Task by ID   DELETE /tasks/:id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
