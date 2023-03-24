
const asyncHandler = require("express-async-handler");
const Todo = require("../models/todoModel");

const sendReminderEmail = async (todo) => {
    const subject = `Reminder: ${todo.title} is due today`;
    const message = `
        <h2>Hello,</h2>
        <p>This is a friendly reminder that your to-do "${todo.title}" is due today (${todo.endDate}).</p>
        <p>Best regards,</p>
        <p>Your To-Do App.</p>
        `;
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
  
    await sendEmail(subject, message, send_to, sent_from);
  };

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

const addNestedTodo = asyncHandler(async (req, res) => {
    const {title, description, endDate } = req.body;
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
    });
  
    await childTodo.save();
    parentTodo.children.push(childTodo);
    await parentTodo.save();
  
    res.status(201).json(childTodo);
  });

 const getTodos = asyncHandler(async(req,res)=>{
    const todo = await Todo.find({user: req.user.id}).sort({endDate:1});
    res.status(200).json(todo);
 })

 const updateTodo = asyncHandler(async(req,res)=>{
    const {title,description,endDate} = req.body;
    const {id} = req.params;

    const todo = await Todo.findById(id);

    if(!todo){
        res.status(404);
        throw new Error('Todo not found');
    }

    if(todo.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        {_id : id},
        {
            title,
            description,
            endDate,
        },
        {
            new: true,
            runValidators : true,
        }
    );

    if (endDate && endDate.toDateString() === new Date().toDateString()) {
        await sendReminderEmail(updatedTodo);
      }

    res.status(200).json(updatedTodo);
 })

 const deleteTodo = asyncHandler(async(req,res)=>{
    const todo = await Todo.findById(req.params.id);
    if(!todo){
        res.status(404);
        throw new Error('Todo not found');
    }
    if(todo.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized');
    }
    await todo.deleteOne();
    res.status(200).json({message : 'Todo deleted successfuly'})
 })

module.exports = {addTodo,addNestedTodo,getTodos,updateTodo,deleteTodo}