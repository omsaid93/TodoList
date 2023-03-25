const express = require("express");
const { addTodo, getTodos, addNestedTodo, updateTodo, deleteTodo, completeTodo } = require("../controllers/todoController");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");

router.post("/", protect, addTodo);
router.post("/:id", protect, addNestedTodo);
router.get("/", protect, getTodos);
router.patch("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);
router.patch("/:id/completed", protect, completeTodo);

module.exports = router;