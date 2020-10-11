import Router from "express";

const userRouter = Router();

userRouter.get('/', (request, response)=>{
  return response.json({ok: "users"});
});

userRouter.post('/', (request, response)=>{
  return response.json({ok: "users"});
});

export default userRouter;