import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { authorize } from "../middlewares/rbac";
import { getAll } from "../controllers/propertyFeatures";

const router = Router();

router.use(verifyAuthentication);

router.get("/", authorize("property-features.view"), getAll);


export default router;