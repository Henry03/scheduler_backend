import { body } from 'express-validator';

export const createChannelValidation = [
    body('type')
        .notEmpty().withMessage('Username is required')
        .isIn(['WHATSAPP', 'TELEGRAM', 'TEAMS', "EMAIL", "CUSTOM"])
        .isString().withMessage('Username must be a string'),
    
    body('url')
        .notEmpty().withMessage('Webhook URL is required')
        .isString().withMessage('Username must be a string'),
];
