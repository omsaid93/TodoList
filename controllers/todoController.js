
const asyncHandler = require("express-async-handler");
const Todo = require("../models/todoModel");

const addTodo = asyncHandler(async(req,res)=>{
    const {title,description,endDate} = req.body;

    if(!title){
        res.status(400);
        throw new Error('please fill the title');
    }

    const todo = await Todo.create({
        user: req.user.id,
        title,
        description,
        endDate,
    });
    res.status(201).json(todo)
})

module.exports = {addTodo}