import Router from "express";
import PointsController from "../controllers/PointsController";
import multer from "multer";
import multerConfig from "../config/multer";

const upload = multer(multerConfig);


const pointsRouter = Router();
const pointsController = new PointsController();

pointsRouter.get('/', pointsController.index);
pointsRouter.get('/:id', pointsController.show);

pointsRouter.post('/', upload.single('img'), pointsController.create);

export default pointsRouter;