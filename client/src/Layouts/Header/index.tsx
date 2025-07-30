import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AccountPopover } from "../../components/AccountPopper";
import { NavButton } from "../../components/NavButtons";
import { NAV_ITEMS, ROUTES } from "../../constants";
import { headerStyle } from "../../constants/StyledConstants";
import { useRouter } from "../../hooks/useRouter";
import { UserRoleEnum } from "../../types";
import { useAuthStore } from "../../zustand/auth/store";

export const Header = ({ isAuth }: { isAuth?: boolean }) => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { role } = user ?? {};

  // const filteredNavItems = NAV_ITEMS.filter((item) => {
  //   // Only show resumes nav button to recruiters
  //   if (item.path === ROUTES.main.resumes && role !== UserRoleEnum.RECRUITER) {
  //     return false;
  //   }
  //   return true;
  // });

  const filteredNavItems = role === UserRoleEnum.RECRUITER ? NAV_ITEMS : [];

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
          sx={{
            cursor: "pointer",
            width: 120,
            height: "100%",
            display: "flex",
            alignItems: "center",
            "& svg": {
              width: "100%",
              height: "auto",
              maxHeight: "60px",
            },
          }}
          onClick={() => router.push(ROUTES.main.dashboard)}
        >
          <Typography
            variant="h3"
            color="primary"
            fontWeight="bold"
            fontStyle="italic"
          >
            ATS
          </Typography>
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
            <Box sx={{ display: "flex", gap: 2, mr: "1.5em !important" }}>
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
