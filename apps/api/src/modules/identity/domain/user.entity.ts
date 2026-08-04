export enum VerificationStatus {
  UNVERIFIED = "UNVERIFIED",
  PARTIAL = "PARTIAL",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

// Mirrors prisma/schema.prisma's User model. Real repository/service logic ships as
// Module 1 — Identity & Auth (TEC-001 §17), once its own 7-point write-up is approved.
export class UserEntity {
  id!: string;
  firebaseUid!: string;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
  verificationStatus!: VerificationStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
