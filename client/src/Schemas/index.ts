import * as yup from "yup";

const rEmail =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export const loginSchema = yup.object({
  email: yup
    .string()
    .matches(rEmail, "Invalid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const signupSchema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup
    .string()
    .matches(rEmail, 'Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .test('password-requirements', 'Password must meet all requirements', function(value) {
      if (!value) return false;
      
      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[@$!%*?&]/.test(value);
      
      if (!hasLowercase) {
        return this.createError({ message: 'Password must contain at least one lowercase letter' });
      }
      if (!hasUppercase) {
        return this.createError({ message: 'Password must contain at least one uppercase letter' });
      }
      if (!hasDigit) {
        return this.createError({ message: 'Password must contain at least one digit' });
      }
      if (!hasSpecialChar) {
        return this.createError({ message: 'Password must contain at least one special character (@$!%*?&)' });
      }
      
      return true;
    })
    .required('Password is required'),
    role: yup.string().required('Role is required'),
});