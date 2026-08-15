import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getRoles } from "../controllers/roles";
// import { getPermissions, getRoles, getRole, createRoleController, updateRoleController, deleteRoleController, } from "../controllers/roles";
// import { roleIdValidation, createRoleValidation, updateRoleValidation, } from "../validations/roles";

const router = Router();

router.use(verifyAuthentication);

// router.get("/permissions", authorize("roles.view"), getPermissions);
router.get("/", authorize("roles.view"), getRoles);
// router.get("/:id", authorize("roles.view"), roleIdValidation, getRole);

// router.post("/", authorize("roles.manage"), createRoleValidation, createRoleController);

// router.put("/:id", authorize("roles.manage"), updateRoleValidation, updateRoleController);

// router.delete("/:id", authorize("roles.manage"), roleIdValidation, deleteRoleController);

export default router;