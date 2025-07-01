import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { UserRoleEnum, type UserRole } from "../../types";
import { useRouter } from "../../hooks/useRouter";
import { useAuthStore } from "../../zustand/auth/store";
import { NAV_ITEMS, ROUTES } from "../../constants";
import { headerStyle } from "../../constants/StyledConstants";
import { NavButton } from "../../components/NavButtons";
import { AccountPopover } from "../../components/AccountPopper";

export const Header = ({ isAuth }: { isAuth?: boolean }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.path === ROUTES.main.resumes) {
      return user?.roles.some(
        (role: UserRole) => role.name === UserRoleEnum.RECRUITER
      );
    }
    return true;
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        ...headerStyle,
        borderBottom: isAuth ? "none" : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { xs: 2, lg: 4 },
          justifyContent: isAuth ? "center" : "space-between",
        }}
      >
        {/* Logo */}
        <Box
          sx={{ cursor: "pointer", width: 80, "& svg": { width: "100%" } }}
          onClick={() => router.push(ROUTES.main.dashboard)}
        >
          {/* <Logo /> */}
          Logo
        </Box>

        {!isAuth && (
          <Stack
            flexGrow={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={{ xs: 0.5, sm: 1 }}
          >
            {/* Navigation Links */}
            <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
              {filteredNavItems.map((item) => (
                <NavButton key={item.path} to={item.path} label={item.label} />
              ))}
            </Box>

            {/* Account Popover */}
            <AccountPopover />
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};
