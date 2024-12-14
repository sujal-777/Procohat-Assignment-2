import  uploadImages from "../controllers/imageController.js";
import { Router } from "express";

const router = Router()

router.post('/upload', uploadImages);

export default router;
