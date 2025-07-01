import { Link, useLocation } from "react-router-dom";
import type { FC } from "react";
import type { NavButtonProps } from "../types";
import { StyledNavButton } from "./Styled";

export const NavButton: FC<NavButtonProps> = ({ to, label, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <StyledNavButton
        color="primary"
        variant="text"
        className={isActive ? "active" : ""}
        {...props}
      >
        {label}
      </StyledNavButton>
    </Link>
  );
};
