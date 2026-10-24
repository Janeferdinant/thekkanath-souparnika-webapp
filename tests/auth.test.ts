import { describe, it, expect } from 'vitest';
import { canManageStaff } from '../src/lib/adminEngine';
import { UserRole } from '../src/types/models';

describe('Authentication & Role Access Tests', () => {
  it('allows super_admin full management access', () => {
    expect(canManageStaff('super_admin')).toBe(true);
    expect(canManageStaff('administrator')).toBe(false);
    expect(canManageStaff('staff')).toBe(false);
  });

  it('correctly evaluates role permissions for venue staff', () => {
    const checkRoleAccess = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
      if (!userRole) return false;
      if (userRole === 'super_admin') return true;
      return allowedRoles.includes(userRole);
    };

    expect(checkRoleAccess('super_admin', ['accounts'])).toBe(true);
    expect(checkRoleAccess('accounts', ['accounts', 'super_admin'])).toBe(true);
    expect(checkRoleAccess('staff', ['accounts'])).toBe(false);
    expect(checkRoleAccess(undefined, ['accounts'])).toBe(false);
  });
});
