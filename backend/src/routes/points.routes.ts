import Router from "express";
import PointsController from "../controllers/PointsController";


const pointsRouter = Router();
const pointsController = new PointsController();

pointsRouter.get('/', pointsController.index);
pointsRouter.get('/:id', pointsController.show);

pointsRouter.post('/', pointsController.create);

export default pointsRouter;