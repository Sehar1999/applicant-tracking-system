import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { PASSWORD } from "../constants";
import type { FC } from "react";
import type { IShowPasswordProps } from "../types";

/**
 * Password input's adornment that shows icon of show/hide password
 *
 * @component
 * @prop {boolean} isPassword - to determine whether it's a password or note
 * @prop {string} passwordType - type of password
 * @prop {function} handleShowPassword - callback function to handle show/hide password adornment
 * @returns {JSX.Element } The JSX element
 */
export const ShowPassword: FC<IShowPasswordProps> = ({
  isPassword,
  passwordType,
  handleShowPassword,
}) => (
  <InputAdornment position="end">
    {isPassword && (
      <IconButton onClick={handleShowPassword} color="secondary">
        {passwordType !== PASSWORD ? (
          <Visibility color="primary" />
        ) : (
          <VisibilityOff color="primary" />
        )}
      </IconButton>
    )}
  </InputAdornment>
);
