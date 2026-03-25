// // services/todo.service.js (BACKEND)
// import Todo from '../models/Todo.js';

// export const TodoService = {
//     async create(data) {
//         return await Todo.create(data);
//     },
    
//     async findAllByAgent(agentId) {
//         return await Todo.find({ agent: agentId }).populate('campaign');
//     },

//     async update(id, updateData) {
//         return await Todo.findByIdAndUpdate(id, updateData, { new: true });
//     },

//     async delete(id) {
//         return await Todo.findByIdAndDelete(id);
//     }
// };