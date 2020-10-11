import Router from "express";
import itemsRouter from "./items.routes";
import pointsRouter from "./points.routes";
import userRouter from "./users.routes";

const routes = Router();

routes.use('/users', userRouter);
routes.use('/items', itemsRouter);
routes.use('/points', pointsRouter);

export default routes;