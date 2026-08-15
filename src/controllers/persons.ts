import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getPersonNotesByPersonId, createPersonNote, deletePersonNoteById, } from "../services/persons";
import { ID } from "../types/variables";

export const getNotes = catchAsyncErrors(async (req: Request, res: Response) => {
  const personId = Number(req.params.personId) as ID;

  const notes = await getPersonNotesByPersonId(personId);

  sendSuccessResponse(res, 200, "Person notes fetched successfully", notes);
});

export const createNote = catchAsyncErrors(async (req: Request, res: Response) => {
  const personId = Number(req.params.personId) as ID;
  const { note } = req.body;

  const personNote = await createPersonNote(personId, note);

  sendSuccessResponse(res, 201, "Person note added successfully", personNote);
});

export const removeNote = catchAsyncErrors(async (req: Request, res: Response) => {
  const personId = Number(req.params.personId) as ID;
  const noteId = Number(req.params.noteId) as ID;

  const data = await deletePersonNoteById(personId, noteId);

  sendSuccessResponse(res, 200, "Person note deleted successfully", data);
});