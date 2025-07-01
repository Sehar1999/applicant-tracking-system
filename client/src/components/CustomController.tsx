import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItem,
  MenuItem,
  Select,
  Switch,
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
import { transformSentence } from "../utils";
import { InfoTooltip } from "./InfoTooltip";
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
  canMultiSelect,
  controllerName,
  controllerLabel,
  placeholderString,
  blurOut,
  isLockIcon,
  isContactInfo,
  autoComplete,
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

  const getCapitalizeAndRemoveHyphen = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const renderField = (
    field: ControllerRenderProps<FieldValues, string>,
    message: string | undefined,
    invalid: boolean
  ) => {
    switch (fieldType) {
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

      case "autocomplete":
        return (
          <>
            <Autocomplete
              {...field}
              sx={{
                margin: "8px 0 4px",
                "& .MuiOutlinedInput-root": {
                  padding: canMultiSelect
                    ? "0px 30px 0 14px !important"
                    : "0 14px !important",
                  background: "white",
                },
              }}
              multiple={canMultiSelect}
              readOnly={readOnly}
              disabled={isDisabled}
              disableClearable={true}
              options={fieldOptions}
              isOptionEqualToValue={(option, value) =>
                option?.value === value.value
              }
              renderOption={(props, option) => {
                const { value, label } = option || {};
                return (
                  <ListItem {...props} key={value}>
                    {getCapitalizeAndRemoveHyphen(label)}
                  </ListItem>
                );
              }}
              getOptionLabel={(option) => option?.name ?? option?.label}
              value={field.value ?? defaultValue}
              onChange={(_, newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    error={invalid}
                    {...params}
                    placeholder={placeholderString}
                    variant="outlined"
                  />
                );
              }}
            />

            {invalid && message && (
              <FormHelperText color="error">{message}</FormHelperText>
            )}

            {invalid && !message && (
              <FormHelperText color="error">{`${field.name} is required`}</FormHelperText>
            )}
          </>
        );

      case "textarea":
        return (
          <Box>
            <TextField
              autoComplete={autoComplete}
              margin="dense"
              InputLabelProps={{
                shrink: false,
              }}
              error={invalid}
              label=""
              defaultValue={defaultValue}
              disabled={isDisabled}
              placeholder={
                transformSentence(controllerLabel) || placeholderString || ""
              }
              rows={rowsLength || 4}
              fullWidth
              {...field}
              helperText={!isContactInfo ? message : ""}
              multiline={true}
              variant="outlined"
              inputProps={{
                maxLength: maxLength || undefined,
                readOnly: readOnly ? true : false,
                onBlur: blurOut,
                style: {
                  padding: "12.5px 2px",
                  opacity: readOnly ? 0.5 : 1,
                  cursor: readOnly ? "not-allowed" : "text",
                },
              }}
              InputProps={
                tooltipText
                  ? {
                      endAdornment: <InfoTooltip title={tooltipText} />,
                    }
                  : undefined
              }
            />
          </Box>
        );

      case "boolean":
        return (
          <FormControl>
            <Box display="flex" gap="10px" alignItems="center" mb={2}>
              <Checkbox
                checked={!!field.value}
                sx={{ padding: 0 }}
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                name={controllerName}
              />

              <FormLabel sx={{ fontSize: "12px" }}>
                {" "}
                {controllerLabel}{" "}
              </FormLabel>
            </Box>
          </FormControl>
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
              // placeholder={
              //   transformSentence(controllerLabel) || placeholderString || ""
              // }
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

      case "checkbox":
      case FIELD_TYPE.checkbox:
        return (
          <FormControl>
            <Box display="flex" gap="10px" alignItems="center" mb={2}>
              <Checkbox
                checked={!!field.value}
                sx={{ padding: 0 }}
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                name={controllerName}
              />

              <FormLabel sx={{ fontSize: "12px" }}>
                {" "}
                {controllerLabel}{" "}
              </FormLabel>
            </Box>
          </FormControl>
        );

      case "switch":
      case FIELD_TYPE.switch:
        return (
          <Switch
            {...field}
            onChange={(value) => {
              field.onChange(value);
            }}
            value={field.value}
            name={controllerName}
            checked={field.value}
          />
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
