import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`📥 [${timestamp}] ${req.method} ${req.url} - IP: ${req.ip} - UA: ${req.get('User-Agent')?.substring(0, 50)}...`);

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? '❌' : '✅';
    
    console.log(`${logLevel} [${timestamp}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  next();
};