import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll, getById, create, update, remove, getUnFavorites, getFavorites, createFavorite, deleteFavorite, getAllIdentified } from "../controllers/clients";
import { clientIdValidation, createClientValidation, updateClientValidation, getClientsQueryValidation, getClientFavoritesValidation, getClientUnFavoritesValidation, addClientFavoriteValidation, removeClientFavoriteValidation } from "../validations/clients";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("clients.view"), getClientsQueryValidation, validation, getAll);
router.get("/identifiers", authorize("clients.view"), getAllIdentified);
router.get("/:clientId/favorites", authorize("clients.view"), getClientFavoritesValidation, validation, getFavorites);
router.get("/:clientId/unfavorites", authorize("clients.view"), getClientUnFavoritesValidation, validation, getUnFavorites);
router.get("/:id", authorize("clients.view"), clientIdValidation, getById);

router.post("/", authorize("clients.manage"), createClientValidation, validation, create);
router.post("/:clientId/favorites/:propertyId", authorize("clients.manage"), addClientFavoriteValidation, validation, createFavorite);

router.put("/:id", authorize("clients.manage"), updateClientValidation, validation, update);

router.delete("/:clientId/favorites/:propertyId", authorize("clients.delete"), removeClientFavoriteValidation, validation, deleteFavorite);
router.delete("/:id", authorize("clients.delete"), clientIdValidation, validation, remove);

export default router;