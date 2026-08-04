import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { SyncUserDto } from "./dto/sync-user.dto";

// Skeleton only (DEC-011 / apps/api/README.md): route, guard, and DTO shape exist so the
// client-facing contract (POST /api/v1/auth/sync per TEC-001 §6) is stable, but the actual
// upsert-by-firebase_uid logic is Module 1 — Identity & Auth's own approved scope.
@Controller("auth")
export class IdentityController {
  @Post("sync")
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  sync(@Body() _dto: SyncUserDto): { message: string } {
    return { message: "Identity module scaffolded — sync logic pending Module 1 approval." };
  }
}
