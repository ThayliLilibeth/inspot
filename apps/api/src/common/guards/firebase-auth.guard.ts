import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import type { Request } from "express";

interface RequestWithUser extends Request {
  user?: admin.auth.DecodedIdToken;
}

// Single point of Firebase ID token verification for protected routes (DEC-005).
// No custom session/JWT issuance — Firebase Admin SDK verifies the client-issued ID token.
@Injectable()
export class FirebaseAuthGuard implements CanActivate, OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get<string>("firebase.projectId"),
          clientEmail: this.configService.get<string>("firebase.clientEmail"),
          privateKey: this.configService.get<string>("firebase.privateKey"),
        }),
      });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const idToken = authHeader.slice("Bearer ".length);

    try {
      request.user = await admin.auth().verifyIdToken(idToken);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
