import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Redo,
  Undo,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type FC } from "react";
import {
  editorContainer,
  toolbarStyles,
} from "../../constants/StyledConstants";
import { StyledEditorContainer, ToolbarButton } from "../../StyledComponents";
import type { JobDescriptionEditorProps } from "../../types";

const JobDescriptionEditor: FC<JobDescriptionEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter job description...",
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
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
    <Card elevation={1} sx={{ height: "fit-content" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Job Description
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create a detailed job description with rich formatting
        </Typography>

        <Box sx={editorContainer}>
          {/* Toolbar */}
          <Box sx={toolbarStyles}>
            {/* Text Formatting */}
            <Tooltip title="Bold" placement="top">
              <ToolbarButton
                size="small"
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                disabled={disabled}
              >
                <FormatBold fontSize="small" />
              </ToolbarButton>
            </Tooltip>
            <Tooltip title="Italic" placement="top">
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

            {/* Lists */}
            <Tooltip title="Bullet List" placement="top">
              <ToolbarButton
                size="small"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                disabled={disabled}
              >
                <FormatListBulleted fontSize="small" />
              </ToolbarButton>
            </Tooltip>
            <Tooltip title="Numbered List" placement="top">
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

            {/* Quote */}
            <Tooltip title="Quote" placement="top">
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

            {/* Undo/Redo */}
            <Tooltip title="Undo" placement="top">
              <ToolbarButton
                size="small"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo() || disabled}
              >
                <Undo fontSize="small" />
              </ToolbarButton>
            </Tooltip>
            <Tooltip title="Redo" placement="top">
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
          <StyledEditorContainer>
            <EditorContent editor={editor} />
          </StyledEditorContainer>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Use the toolbar above to format your job description
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getCharacterCount()} characters
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionEditor;
