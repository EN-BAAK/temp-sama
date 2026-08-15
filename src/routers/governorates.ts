import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAllGovs, getGovById, createGov, updateGov, removeGov, createCityController, updateCityNameController, removeCityController, getAllCities, } from "../controllers/governorates";
import { governorateIdValidation, createGovernorateValidation, updateGovernorateValidation, cityIdValidation, createCityValidation, updateCityNameValidation, } from "../validations/governorates";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("locations.view"), getAllGovs);
router.get("/cities", authorize("locations.view"), getAllCities);
router.get("/:id", authorize("locations.view"), governorateIdValidation, validation, getGovById);

router.post("/", authorize("locations.manage"), createGovernorateValidation, validation, createGov);
router.post("/:id/cities", authorize("locations.manage"), createCityValidation, validation, createCityController);

router.patch("/cities/:id", authorize("locations.manage"), updateCityNameValidation, validation, updateCityNameController);
router.patch("/:id", authorize("locations.manage"), updateGovernorateValidation, validation, updateGov);

router.delete("/cities/:id", authorize("locations.delete"), cityIdValidation, validation, removeCityController);
router.delete("/:id", authorize("locations.delete"), governorateIdValidation, validation, removeGov);



export default router;