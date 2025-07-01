import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { CustomPopover, usePopover } from "./CustomPopper";
import { useRouter } from "../hooks/useRouter";
import { useAuthStore } from "../zustand/auth/store";
import { AUTH_LINKS, PROFILE_POPOVER_OPTIONS } from "../constants";

export const AccountPopover = () => {
  const router = useRouter();

  const { logout, user } = useAuthStore();
  const { full_name, email } = user || {};
  const popover = usePopover();

  const handleLogout = async () => {
    try {
      logout();
      popover.onClose();
      router.replace(AUTH_LINKS.SIGN_IN_LINK);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) => theme.palette.primary.main,
          }),
        }}
      >
        <Avatar
          alt={full_name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {full_name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 200, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap fontWeight="bold">
            {full_name}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {PROFILE_POPOVER_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: "fontWeightBold", color: "error.main" }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
};
