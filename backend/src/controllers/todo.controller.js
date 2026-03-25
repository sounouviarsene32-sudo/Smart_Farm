import Todo from '../models/Todo.model.js';
import Agent from '../models/Agent.model.js';

export const createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate, agentId, campaignId } = req.body;

        // 1. Création de la tâche
        const newTodo = new Todo({
            title,
            description,
            priority,
            dueDate,
            agent: agentId,
            campaign: campaignId,
            createdBy: req.user?._id
        });

        const savedTodo = await newTodo.save();

        // 2. LIAISON : On ajoute l'ID de la tâche dans le tableau 'todo' de l'Agent
        await Agent.findByIdAndUpdate(agentId, {
            $push: { todo: savedTodo._id }
        });

        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer les tâches d'un agent via l'Agent lui-même (avec populate)
export const getAgentWithTodos = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.agentId)
            .populate({
                path: 'todo',
                options: { sort: { createdAt: -1 } },
                populate: { path: 'campaign', select: 'name' }
            });
        
        if (!agent) return res.status(404).json({ message: "Agent non trouvé" });
        res.status(200).json(agent.todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTodoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, description, priority, dueDate } = req.body;

        // On cherche la tâche et on la met à jour
        // { new: true } renvoie le document modifié au lieu de l'original
        // { runValidators: true } force Mongoose à vérifier les 'enum' du schéma
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { 
                status, 
                title, 
                description, 
                priority, 
                dueDate 
            },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        // Erreur 400 si le statut envoyé n'est pas dans l'enum (pending, completed, etc.)
        res.status(400).json({ message: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Tâche non trouvée" });

        // Retirer la référence chez l'agent avant de supprimer la tâche
        await Agent.findByIdAndUpdate(todo.agent, {
            $pull: { todo: todo._id }
        });

        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Tâche supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};