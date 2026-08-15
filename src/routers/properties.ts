import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll, getById, create, update, remove, deleteNote, getSettingsById, deleteImage, getFeatures, getImages, getNotes, createNote, getOwner, getAllIdentifiers, getAllUnsignedIdentifiers, getPlans, deletePlan } from "../controllers/properties";
import { propertyIdValidation, createPropertyValidation, updatePropertyValidation, getPropertiesQueryValidation, createNoteValidation, noteIdValidation, imageIdValidation, planIdValidation } from "../validations/properties";
import { uploadPropertyFiles } from "../utils/multer";
import { validateAndCleanup } from "../middlewares/uploadsFiles";
import { validation } from "../middlewares/error";

const uploadFields = uploadPropertyFiles.fields([
  { name: "background", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "plans", maxCount: 10 },
]);

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("properties.view"), getPropertiesQueryValidation, validation, getAll);
router.get("/identifiers", authorize("properties.view"), getAllIdentifiers);
router.get("/unsigned-identifiers", authorize("properties.view"), getAllUnsignedIdentifiers);
router.get("/:propertyId/notes", authorize("properties.view"), propertyIdValidation, validation, getNotes);
router.get("/:propertyId/features", authorize("properties.view"), propertyIdValidation, validation, getFeatures);
router.get("/:propertyId/images", authorize("properties.view"), propertyIdValidation, validation, getImages);
router.get("/:propertyId/plans", authorize("properties.view"), propertyIdValidation, validation, getPlans);
router.get("/:propertyId/owner", authorize("owners.view"), propertyIdValidation, validation, getOwner);
router.get("/:id/settings", authorize("properties.view"), propertyIdValidation, validation, getSettingsById);
router.get("/:id", authorize("properties.view"), propertyIdValidation, validation, getById);

router.post("/", authorize("properties.manage"), uploadFields, createPropertyValidation, validation, validateAndCleanup, create);
router.post("/:propertyId/notes", authorize("properties.manage"), createNoteValidation, validation, createNote);

router.put("/:id", authorize("properties.manage"), propertyIdValidation, uploadFields, updatePropertyValidation, validation, validateAndCleanup, update);

router.delete("/images/:imageId", authorize("properties.delete"), imageIdValidation, validation, deleteImage);
router.delete("/plans/:planId", authorize("properties.delete"), planIdValidation, validation, deletePlan);
router.delete("/notes/:noteId", authorize("properties.delete"), noteIdValidation, validation, deleteNote);
router.delete("/:id", authorize("properties.delete"), propertyIdValidation, validation, remove);



export default router;