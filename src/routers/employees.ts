import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll, getById, create, update, remove, getAllIdentified, } from "../controllers/employees";
import { employeeIdValidation, createEmployeeValidation, updateEmployeeValidation, getEmployeesQueryValidation, } from "../validations/employees";
import { validation } from "../middlewares/error";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("employees.view"), getEmployeesQueryValidation, validation, getAll);
router.get("/identifiers", authorize("employees.view"), getAllIdentified);
router.get("/:id", authorize("employees.view"), employeeIdValidation, validation, getById);

router.post("/", authorize("employees.manage"), createEmployeeValidation, validation, create);

router.put("/:id", authorize("employees.manage"), updateEmployeeValidation, validation, update);

router.delete("/:id", authorize("employees.delete"), employeeIdValidation, validation, remove);

export default router;