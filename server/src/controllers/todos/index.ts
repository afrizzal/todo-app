import { Request, Response } from 'express';

import TodoModel from '../../models/todo';
import { Todo } from '../../types/todo';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const todos: Todo[] = await TodoModel.find();

    res.status(200).json({ todos });
};

export const getTodo = async (req: Request, res: Response): Promise<void> => {
    await TodoModel.findById(req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        } else {
            res.status(200).json({ result })
        }
    })
};

export const addTodo = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Pick<Todo, 'title' | 'status'>;

    // If all or one of the required body is undefined
    if (!body.title || !body.status) {
        res.status(401).json({
            status: 401,
            errorMessage: `ValidationError: Todo validation failed: title: ${body.title}, status: ${body.status}`
        });

        return;
    }

    const newTodoModel: Todo = new TodoModel({
        title: body.title,
        status: body.status
    });

    const newTodo = await newTodoModel.save();
    const allTodos = await TodoModel.find();

    res.status(201).json({
        message: 'Todo successfully added!',
        todo: newTodo,
        todos: allTodos
    });
}

