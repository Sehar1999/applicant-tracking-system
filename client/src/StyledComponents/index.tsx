import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";

export const StyledEditorContainer = styled(Box)(({ theme }) => ({
  "& .ProseMirror": {
    outline: "none",
    minHeight: "200px",
    padding: theme.spacing(2),
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    lineHeight: 1.6,
    color: theme.palette.text.primary,
    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: theme.palette.text.secondary,
      pointerEvents: "none",
      height: 0,
    },
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      fontWeight: 600,
    },
    "& ul, & ol": {
      paddingLeft: theme.spacing(3),
    },
    "& blockquote": {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      margin: theme.spacing(2, 0),
      padding: theme.spacing(1, 2),
      backgroundColor: `${theme.palette.primary.main}08`,
      fontStyle: "italic",
    },
  },
}));

export const ToolbarButton = styled(IconButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: active ? `${theme.palette.primary.main}20` : "transparent",
    "&:hover": {
      backgroundColor: active
        ? `${theme.palette.primary.main}30`
        : theme.palette.action.hover,
    },
    "&.Mui-disabled": {
      color: theme.palette.action.disabled,
    },
  })
);
