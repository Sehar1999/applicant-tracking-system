import { AccessDenied } from "../components/AccessDenied";
import { UserRoleEnum } from "../types";
import { useAuthStore } from "../zustand/auth/store";

interface RoleBasedGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRoleEnum[];
  requiredRole?: UserRoleEnum;
}

export const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({
  children,
  allowedRoles,
  requiredRole,
}) => {
  const { user } = useAuthStore();
  const { role } = user ?? {};
  const hasRequiredRole = allowedRoles.includes(role as UserRoleEnum);
  const hasSpecificRole = requiredRole ? role === requiredRole : true;

  // If user is not logged in or user data is missing, deny access
  if (!user || !role || !hasRequiredRole || !hasSpecificRole) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
