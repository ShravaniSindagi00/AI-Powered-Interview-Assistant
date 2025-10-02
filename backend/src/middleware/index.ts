import { Request, Response, NextFunction } from 'express'

// Logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log('Request body:', req.body)
  next()
}

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
}

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
}
