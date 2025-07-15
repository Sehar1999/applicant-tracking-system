import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, type FC } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";
import { FIELD_TYPE } from "../constants";
import type { CustomControlProps, PasswordType, SelectOptions } from "../types";
import DocumentUpload from "./DocumentUpload";
import { InfoTooltip } from "./InfoTooltip";
import JobDescriptionEditor from "./JobDescriptionEditor";
import { ShowPassword } from "./ShowPAssword";

/**
 * It takes multiple params to show a customized input field which can have multiple types.
 *
 * @prop {boolean} isDisabled - used for disabling custom field (multiple filed types e.g. password, text, email)
 * @prop {string} controllerName - used for adding ID and name
 * @prop {string} controllerLabel - used for adding label on textfield
 * @prop {string} fieldType - used for showing selected options in select field
 * @prop {isMultiLine} isMultiLine - used for showing text area
 * @returns JSX Element
 */
export const CustomController: FC<CustomControlProps> = ({
  min,
  readOnly,
  fieldType,
  maxLength,
  isDisabled,
  isPassword,
  rowsLength,
  isMultiLine,
  tooltipText,
  defaultValue,
  selectOptions,
  controllerName,
  controllerLabel,
  placeholderString,
  blurOut,
  isLockIcon,
  isContactInfo,
  autoComplete,
  maxFiles,
}) => {
  const { control } = useFormContext();
  const [passwordType, setPasswordType] = useState<PasswordType>(
    FIELD_TYPE.password
  );
  const fieldOptions =
    selectOptions?.map((item: SelectOptions) => ({
      label: item?.name ?? item.label,
      value: item.value,
    })) || [];

  const getInputType = (fieldType: string) => {
    if (fieldType === "password" || fieldType === FIELD_TYPE.password) {
      return passwordType;
    }
    if (fieldType === "number" || fieldType === FIELD_TYPE.number) {
      return "number";
    }
    if (fieldType === "email" || fieldType === FIELD_TYPE.email) {
      return "email";
    }
    return "text";
  };

  const handleClickShowPassword = () => {
    if (passwordType === FIELD_TYPE.password) {
      setPasswordType(FIELD_TYPE.text);
    } else {
      setPasswordType(FIELD_TYPE.password);
    }
  };

  const renderField = (
    field: ControllerRenderProps<FieldValues, string>,
    message: string | undefined,
    invalid: boolean
  ) => {
    switch (fieldType) {
      case "jobDescription":
        return (
          <Box>
            <JobDescriptionEditor
              field={field}
              placeholder={placeholderString}
              disabled={isDisabled}
            />
            {invalid && message && (
              <FormHelperText sx={{ color: "#d32f2f", mt: 1 }}>
                {message}
              </FormHelperText>
            )}
          </Box>
        );

      case "documentUpload":
        return (
          <Box>
            <DocumentUpload
              field={field}
              maxFiles={maxFiles || 5}
              disabled={isDisabled}
            />
            {invalid && message && (
              <FormHelperText sx={{ color: "#d32f2f", mt: 1 }}>
                {message}
              </FormHelperText>
            )}
          </Box>
        );

      case "select":
      case FIELD_TYPE.select:
        return (
          <Box>
            <Select
              fullWidth
              sx={{ marginTop: "10px" }}
              {...field}
              id={`select-${field.name}`}
              value={field.value || ""}
              onChange={(event) => {
                field.onChange(event.target.value);
              }}
              error={invalid}
            >
              {fieldOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {invalid && message && (
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {message}
              </FormHelperText>
            )}
          </Box>
        );

      case "text":
      case "email":
      case "number":
      case "password":
      case FIELD_TYPE.text:
      case FIELD_TYPE.email:
      case FIELD_TYPE.number:
      case FIELD_TYPE.password:
        return (
          <Box>
            <TextField
              autoComplete={autoComplete}
              type={getInputType(fieldType)}
              margin="dense"
              InputLabelProps={{
                shrink: false,
              }}
              error={invalid}
              defaultValue={defaultValue}
              disabled={isDisabled}
              rows={isMultiLine ? rowsLength : undefined}
              fullWidth
              {...field}
              helperText={!isContactInfo ? message : ""}
              multiline={isMultiLine}
              variant="outlined"
              inputProps={{
                maxLength: maxLength || undefined,
                readOnly: readOnly ? true : false,
                min: min || 0,
                onBlur: blurOut,
                style: {
                  padding: isMultiLine ? "12.5px 2px" : "auto",
                  opacity: readOnly ? 0.5 : 1,
                  cursor: readOnly ? "not-allowed" : "text",
                },
              }}
              InputProps={
                tooltipText
                  ? {
                      endAdornment: <InfoTooltip title={tooltipText} />,
                    }
                  : isPassword
                  ? {
                      endAdornment: (
                        <ShowPassword
                          isPassword={isPassword}
                          passwordType={passwordType}
                          handleShowPassword={handleClickShowPassword}
                        />
                      ),
                    }
                  : isLockIcon
                  ? {
                      startAdornment: (
                        <Box mt="5px">
                          <VisibilityOffOutlinedIcon color="primary" />
                        </Box>
                      ),
                    }
                  : undefined
              }
            />
          </Box>
        );

      default:
        return <div>Unsupported field type: {fieldType}</div>;
    }
  };

  return (
    <FormControl fullWidth>
      <FormLabel>{controllerLabel}</FormLabel>
      <Controller
        name={controllerName}
        control={control}
        render={({
          field,
          fieldState: { invalid, error: { message } = {} },
        }) => {
          return (
            renderField(field, message, invalid) || (
              <div>Error rendering field</div>
            )
          );
        }}
      />
    </FormControl>
  );
};
