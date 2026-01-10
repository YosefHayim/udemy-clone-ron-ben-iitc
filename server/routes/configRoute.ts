import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  });
});

export default router;
