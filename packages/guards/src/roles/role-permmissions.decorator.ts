import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@packages/database';

// 운영자(OPERATOR)와 관리자(ADMIN)만 접근 가능한 기능 - 이벤트/보상 등록
export const OperatorAccess = () =>
  SetMetadata('roles', [UserRole.OPERATOR, UserRole.ADMIN]);

// 감사자(AUDITOR)와 관리자(ADMIN)만 접근 가능한 기능 - 보상 이력 조회
export const AuditorAccess = () =>
  SetMetadata('roles', [UserRole.AUDITOR, UserRole.ADMIN]);

// 일반 사용자(USER)와 관리자(ADMIN)만 접근 가능한 기능 - 보상 요청
export const UserAccess = () =>
  SetMetadata('roles', [UserRole.USER, UserRole.ADMIN]);

// 관리자(ADMIN)만 접근 가능한 기능
export const AdminOnly = () => SetMetadata('roles', [UserRole.ADMIN]);
