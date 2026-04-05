import { NextFunction, Request, Response } from "express";
import { tableExists } from "../utils/tableValidator";

export async function validateTable(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { resource } = req.params;

  // check tồn tại
  if (!resource || typeof resource !== 'string') {
    return res.status(400).json({
      error: 'Invalid resource name',
    });
  }
  next();
}
