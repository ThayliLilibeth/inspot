import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import type { Request } from "express";
import { PinoLogger } from "nestjs-pino";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { resolveErrorCode } from "../errors/error-code";

// `id` is already provided by pino-http's Express type augmentation.
interface RequestWithContext extends Request {
  user?: { uid?: string };
}

// Structured request logging per DEC-009: requestId, userId, hotspotId, executionTimeMs, errorCode.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const start = Date.now();
    const requestId = request.id;
    const userId = request.user?.uid;
    const hotspotId = request.headers["x-hotspot-id"];

    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          { requestId, userId, hotspotId, executionTimeMs: Date.now() - start },
          "request completed",
        );
      }),
      catchError((error: unknown) => {
        this.logger.error(
          {
            requestId,
            userId,
            hotspotId,
            executionTimeMs: Date.now() - start,
            errorCode: resolveErrorCode(error),
          },
          "request failed",
        );
        throw error;
      }),
    );
  }
}
