import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll, getById, create, update, remove, getOwnerProperties, assignProperty, unassignProperty, getAllIdentified } from "../controllers/owners";
import { ownerIdValidation, createOwnerValidation, updateOwnerValidation, getOwnersQueryValidation, assignPropertyValidation, unassignPropertyValidation } from "../validations/owners";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("owners.view"), getOwnersQueryValidation, validation, getAll);
router.get("/identifiers", authorize("owners.view"), getAllIdentified);
router.get("/:id/properties", authorize("owners.view"), getOwnerProperties);
router.get("/:id", authorize("owners.view"), ownerIdValidation, validation, getById);

router.post("/", authorize("owners.manage"), createOwnerValidation, validation, create);

router.put("/:id", authorize("owners.manage"), updateOwnerValidation, validation, update);

router.patch("/property/:ownerId/:propertyId", authorize("owners.manage"), assignPropertyValidation, validation, assignProperty);

router.delete("/property/:ownerId/:propertyId", authorize("owners.delete"), unassignPropertyValidation, validation, unassignProperty);
router.delete("/:id", authorize("owners.delete"), ownerIdValidation, remove);

export default router;