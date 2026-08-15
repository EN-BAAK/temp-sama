import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllProperties, getPropertyById, createProperty, updateProperty, deletePropertyById, getPropertyNotes, createPropertyNote, deletePropertyNoteById, getPropertySettingsById, deletePropertyImageById, getPropertyFeatures, getPropertyImages, getPropertyOwner, getPropertiesIdentifiers, getUnsignedPropertiesIdentifiers, getPropertyPlans, deletePropertyPlanById, } from "../services/properties";
import { ID } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: Request, res: Response) => {
  const { pa, l, ca, ci, map, mip, se, st, o, pu, } = req.query

  const data = await getAllProperties({
    pa: Number(pa),
    l: Number(l),
    ca: Number(ca),
    ci: Number(ci),
    map: Number(map),
    mip: Number(mip),
    se: se ? String(se) : undefined,
    st: st ? String(st) : undefined,
    o: Number(o),
    pu: pu ? String(pu) : undefined
  });

  sendSuccessResponse(res, 200, "Properties fetched successfully", data);
});

export const getAllIdentifiers = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getPropertiesIdentifiers();
  sendSuccessResponse(res, 200, "Properties fetched successfully", data);
});

export const getAllUnsignedIdentifiers = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getUnsignedPropertiesIdentifiers();
  sendSuccessResponse(res, 200, "Properties fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const property = await getPropertyById(id);
  sendSuccessResponse(res, 200, "Property fetched successfully", property);
});

export const getSettingsById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const property = await getPropertySettingsById(id);
  sendSuccessResponse(res, 200, "Property fetched successfully", property);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const data = req.body

  const backgroundFile = files?.background ? files.background[0] : undefined;
  const galleryFiles = files?.images;
  const planFiles = files?.plans;
  const featuresInput = req.body.features;

  const property = await createProperty(
    data,
    backgroundFile,
    galleryFiles,
    planFiles,
    featuresInput
  );
  sendSuccessResponse(res, 201, "Property created successfully", property);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const data = req.body

  const backgroundFile = files?.background ? files.background[0] : undefined;
  const galleryFiles = files?.images;
  const planFiles = files?.plans;
  const featuresInput = req.body.features;

  const property = await updateProperty(
    id,
    data,
    backgroundFile,
    galleryFiles,
    planFiles,
    featuresInput
  );
  sendSuccessResponse(res, 200, "Property updated successfully", property);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deletePropertyById(id);
  sendSuccessResponse(res, 200, "Property deleted successfully", data);
});

export const deleteImage = catchAsyncErrors(async (req: Request, res: Response) => {
  const imageId = Number(req.params.imageId) as ID;
  await deletePropertyImageById(imageId);
  sendSuccessResponse(res, 200, "Image deleted successfully", { id: imageId });
});

export const deletePlan = catchAsyncErrors(async (req: Request, res: Response) => {
  const planId = Number(req.params.planId) as ID;
  await deletePropertyPlanById(planId);
  sendSuccessResponse(res, 200, "Plan deleted successfully", { id: planId });
});

export const getNotes = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const notes = await getPropertyNotes(propertyId);
  sendSuccessResponse(res, 200, "Notes fetched successfully", notes);
});

export const getFeatures = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const features = await getPropertyFeatures(propertyId);
  sendSuccessResponse(res, 200, "Features fetched successfully", features);
});

export const getImages = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const images = await getPropertyImages(propertyId);
  sendSuccessResponse(res, 200, "Images fetched successfully", images);
});

export const getPlans = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const plans = await getPropertyPlans(propertyId);
  sendSuccessResponse(res, 200, "Plans fetched successfully", plans);
});

export const getOwner = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const features = await getPropertyOwner(propertyId);
  sendSuccessResponse(res, 200, "Owner fetched successfully", features);
});

export const createNote = catchAsyncErrors(async (req: Request, res: Response) => {
  const propertyId = Number(req.params.propertyId) as ID;
  const { note } = req.body;
  const newNote = await createPropertyNote(propertyId, note);
  sendSuccessResponse(res, 201, "Note created successfully", newNote);
});

export const deleteNote = catchAsyncErrors(async (req: Request, res: Response) => {
  const noteId = Number(req.params.noteId) as ID;
  await deletePropertyNoteById(noteId);
  sendSuccessResponse(res, 200, "Note deleted successfully", { id: noteId });
});