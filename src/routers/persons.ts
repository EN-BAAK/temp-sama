import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getNotes, createNote, removeNote, } from "../controllers/persons";
import { getPersonNotesValidation, createPersonNoteValidation, personNoteIdValidation, } from "../validations/persons";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/:personId/notes", authorize("persons.view"), getPersonNotesValidation, validation, getNotes);

router.post("/:personId/notes", authorize("persons.manage"), createPersonNoteValidation, validation, createNote);

router.delete("/:personId/notes/:noteId", authorize("persons.delete"), personNoteIdValidation, validation, removeNote);

export default router;