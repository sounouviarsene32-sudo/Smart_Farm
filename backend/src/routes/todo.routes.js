import express from 'express';
import { createTodo, getAgentWithTodos, deleteTodo, updateTodoStatus } from '../controllers/todo.controller.js';

const router = express.Router();

router.post('/', createTodo);
router.get('/agent/:agentId', getAgentWithTodos);
router.delete('/:id', deleteTodo);
router.patch('/:id', updateTodoStatus);

export default router;