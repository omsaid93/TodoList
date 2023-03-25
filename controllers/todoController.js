const express = require('express');
const app = express();
const asyncHandler = require("express-async-handler");
const Todo = require("../models/todoModel");
const sendEmail = require("../utils/sendEmail")
const moment = require("moment");
const CronJob = require("cron").CronJob;
const User = require('../models/userModel')

app.set('view engine', 'ejs');

const job = new CronJob("0 */12 * * *", async () => {
    // Get all the todos with endDate equals to today's date after every 12 hours

    const todos = await Todo.find({
        endDate: { $lte: moment().endOf("day") },
    });
    // Send a reminder email for each todo      
    todos.forEach((todo) => {
        if (moment(todo.endDate).isSame(moment(), 'day')) {
            sendReminderEmail(todo, todo.user.email);
        }
    });
});

job.start();

//Send email
const sendReminderEmail = async (todo, email) => {
    const user = await User.findOne(email);
    const userEmail = user.email;
    if (!user) {
        console.log(`User not found for todo ${todo._id}`);
        return;
    }
    const subject = `Reminder: ${todo.title} is due today`;
    const message = `
        <h2>Hello,</h2>
        <p>This is a friendly reminder that your to-do "${todo.title}" is due today (${todo.endDate}).</p>
        <p>Best regards,</p>
        <p>Your To-Do App.</p>
        `;
    const send_to = userEmail;
    const sent_from = process.env.EMAIL_USER;

    await sendEmail(subject, message, send_to, sent_from);
    console.log(sendEmail);
};

//add Todo parent
const addTodo = asyncHandler(async (req, res) => {
    const { title, description, endDate, priority } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('please fill the title');
    }

    const todo = await Todo.create({
        user: req.user.id,
        title,
        description,
        endDate,
        priority,
    });
    res.status(201).json(todo)
})

//create todo child
const addNestedTodo = asyncHandler(async (req, res) => {
    const { title, description, endDate, priority } = req.body;
    const parentTodo = await Todo.findById(req.params.id);

    if (!parentTodo) {
        res.status(404);
        throw new Error('Parent Todo not found');
    }

    if (!Array.isArray(parentTodo.children)) {
        parentTodo.children = [];
    }

    const childTodo = new Todo({
        user: req.user.id,
        title,
        description,
        endDate,
        priority,
    });

    await childTodo.save();
    parentTodo.children.push(childTodo);
    await parentTodo.save();

    res.status(201).json(childTodo);
});

//get all user's todo
const getTodos = asyncHandler(async (req, res) => {
    const todo = await Todo.find({ user: req.user.id }).sort({ priority: -1 });
    res.status(200).json(todo);
    res.render('todos', { todo })
})

//update todo
const updateTodo = asyncHandler(async (req, res) => {
    const { title, description, endDate, priority } = req.body;
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        { _id: id },
        {
            title,
            description,
            endDate,
            priority,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json(updatedTodo);
})

//delete todo
const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    await todo.deleteOne();
    res.status(200).json({ message: 'Todo deleted successfuly' })
});

//change todo status complete (true/false)
const completeTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        { _id: id },
        { $set: { completed: !todo.completed } },
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedTodo);
})


module.exports = { addTodo, addNestedTodo, getTodos, updateTodo, deleteTodo, completeTodo }