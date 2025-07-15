import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Redo,
  Undo,
} from "@mui/icons-material";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type FC } from "react";
import { toolbarStyles } from "../../constants/StyledConstants";
import { StyledEditorContainer, ToolbarButton } from "../../StyledComponents";
import type { JobDescriptionEditorProps } from "../../types";

const JobDescriptionEditor: FC<JobDescriptionEditorProps> = ({
  field,
  placeholder = "Enter job description...",
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: field.value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      field.onChange(editor.getText());
    },
    editorProps: {
      attributes: {
        "data-placeholder": placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const getCharacterCount = () => {
    return editor.getText().length;
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      {/* Toolbar */}
      <Box sx={toolbarStyles}>
        <Tooltip title="Bold">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            disabled={disabled}
          >
            <FormatBold fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Tooltip title="Italic">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            disabled={disabled}
          >
            <FormatItalic fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Tooltip title="Bullet List">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            disabled={disabled}
          >
            <FormatListBulleted fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            disabled={disabled}
          >
            <FormatListNumbered fontSize="small" />
          </ToolbarButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Tooltip title="Quote">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            disabled={disabled}
          >
            <FormatQuote fontSize="small" />
          </ToolbarButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Tooltip title="Undo">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled}
          >
            <Undo fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Tooltip title="Redo">
          <ToolbarButton
            size="small"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled}
          >
            <Redo fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StyledEditorContainer sx={{ flex: 1, p: 2 }}>
          <EditorContent editor={editor} />
        </StyledEditorContainer>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Use toolbar to format text
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {getCharacterCount()} characters
        </Typography>
      </Box>
    </Box>
  );
};

export default JobDescriptionEditor;
