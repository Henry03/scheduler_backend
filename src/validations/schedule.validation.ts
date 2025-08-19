import { body } from 'express-validator';

export const createScheduleValidation = [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("description").isString().notEmpty().withMessage("Description is required"),
    body("ai").isBoolean().withMessage("AI must be a boolean value"),
    body("instruction").custom((value, { req }) => {
        if (req.body.ai  && (value === null || value === undefined)) {
        throw new Error("Instruction is required");
        }
        return true;
    }),
    body("tagId").isString().notEmpty().withMessage("Tag ID is required"),

    body("startTime").isISO8601().toDate().withMessage("Start time must be a valid date"),
    body("endTime").isISO8601().toDate().withMessage("End time must be a valid date"),

    body("repeat").isBoolean().withMessage("Repeat must be a boolean value"),

    body("repeatType")
        .optional()
        .isIn(['SECONDLY', 'MINUTELY', 'HOURLY', "DAILY", "MONTHLY", "YEARLY"])
        .withMessage("Repeat type must be one of: DAILY, MONTHLY, YEARLY"),

    body("repeatInterval")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Repeat interval must be a positive integer"),

    body("repeatLimit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Repeat limit must be a positive integer"),

    body("repeatUntil")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Repeat until must be a valid date")
        .custom((value, { req }) => {   
            if (value && req.body.startTime && new Date(value) <= new Date(req.body.startTime)) {
                throw new Error("Repeat until must be greater than start time");
            }
            return true;
        }),,

    body("reminders")
        .optional()
        .isArray()
        .withMessage("Reminders must be an array"),

    body("skipTags")
        .isArray()
        .withMessage("Skip tags must be an array"),

    body("channels")
        .isArray()
        .withMessage("Channels must be an array"),

    body("reminders.*.type")
        .isIn(["SECONDS", "MINUTES", "HOURS", "DAYS"])
        .withMessage("Reminder type must be one of: MINUTES, HOURS, DAYS"),

    body("reminders.*.value")
        .isInt({ min: 0 })
        .withMessage("Reminder value must be a positive integer"),

    body("repeatExceptions")
        .optional()
        .isArray()
        .withMessage("Repeat exceptions must be an array"),

    body("repeatExceptions.*.type")
        .optional()
        .isIn(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
        .withMessage("Exception type must be one of: DAILY, WEEKLY, MONTHLY, YEARLY"),

    body("repeatExceptions.*.value")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Exception value must be a positive integer"),

    // Conditional validations
    body("repeatInterval").custom((value, { req }) => {
        if (req.body.repeat === true && (value === null || value === undefined)) {
        throw new Error("Repeat interval is required when repeat is true");
        }
        return true;
    }),

    body("repeatLimit").custom((value, { req }) => {
        if (req.body.repeat === true && !value && !req.body.repeatUntil) {
        throw new Error("Either repeatLimit or repeatUntil must be provided when repeat is true");
        }
        return true;
    }),

    body("repeatUntil").custom((value, { req }) => {
        if (req.body.repeat === true && !value && !req.body.repeatLimit) {
        throw new Error("Either repeatUntil or repeatLimit must be provided when repeat is true");
        }
        return true;
    }),

    body("repeatType").custom((value, { req }) => {
        if (req.body.repeat === true && (value === null || value === undefined)) {
        throw new Error("Repeat type is required when repeat is true");
        }
        return true;
    }),
];