const express = require("express");
const { addTodo } = require("../controllers/todoController");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");



router.post("/", protect, addTodo);
// router.patch("/:id", updateTodo);
// router.get("/", getTodos);
// router.get("/:id", getTodo);
// router.delete("/:id", deleteTodo);

module.exports = router;