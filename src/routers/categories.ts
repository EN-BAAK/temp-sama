import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll, getById, create, update, remove } from "../controllers/categories";
import { categoryIdValidation, createCategoryValidation, updateCategoryValidation, } from "../validations/categories";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("categories.view"), getAll);
router.get("/:id", authorize("categories.view"), categoryIdValidation, validation, getById);

router.post("/", authorize("categories.manage"), createCategoryValidation, validation, create);

router.put("/:id", authorize("categories.manage"), updateCategoryValidation, validation, update);

router.delete("/:id", authorize("categories.delete"), categoryIdValidation, validation, remove);

export default router;