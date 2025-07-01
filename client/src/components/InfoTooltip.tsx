import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, useMediaQuery } from "@mui/material";
import { useState, type FC } from "react";
import type { TitleProp } from "../types";

/**
 * It takes title to show as a tooltip message
 *
 * @prop {string} title - used for displaying title as tooltip text
 * @returns JSX Element
 */
export const InfoTooltip: FC<TitleProp> = ({ title }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleTooltipToggle = () => {
    if (isMobile) {
      setShowTooltip((prev) => !prev);
    }
  };

  return (
    <Tooltip
      open={isMobile ? showTooltip : undefined}
      onClose={() => setShowTooltip(false)}
      enterTouchDelay={0}
      PopperProps={{ style: { zIndex: 9999999 } }}
      title={title}
    >
      <InfoOutlinedIcon
        onClick={handleTooltipToggle}
        onMouseEnter={() => !isMobile && setShowTooltip(true)}
        onMouseLeave={() => !isMobile && setShowTooltip(false)}
        color="inherit"
        fontSize="small"
      />
    </Tooltip>
  );
};
