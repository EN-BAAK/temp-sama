import { body } from "express-validator";
import { positiveIntValidation } from "../utils/validation";

export const getPersonNotesValidation = [
  positiveIntValidation("personId", "param"),
];

export const createPersonNoteValidation = [
  positiveIntValidation("personId", "param"),

  body("note")
    .notEmpty()
    .withMessage("Note content is required")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Note content must be between 1 and 500 characters")
    .escape(),
];

export const personNoteIdValidation = [
  positiveIntValidation("personId", "param"),
  positiveIntValidation("noteId", "param"),
];