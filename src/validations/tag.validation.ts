import { body } from 'express-validator';

export const createTagValidation = [
    body('name')
        .notEmpty().withMessage('Tag name is required')
        .isString().withMessage('Tag name must be a string'),
    
    body('color')
        .notEmpty().withMessage('Color is required')
        .isString().withMessage('Color must be a string'),
];
