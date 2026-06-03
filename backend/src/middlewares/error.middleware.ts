import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next
  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json({ message: err.message, details: err.details })
    return
  }

  res.status(500).json({ message: 'Internal server error' })
}
