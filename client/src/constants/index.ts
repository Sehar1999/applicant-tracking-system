import { UserRoleEnum, type FormField } from "../types";

export const AUTH_STORAGE = 'auth-storage';

export const ROUTES = {
  auth: {
    main: '/auth',
    login: 'login',
    register: 'register',
  },
  main: {
    dashboard: '/',
    resumes: '/resumes',
    profile: '/profile',
  },
  notFound: '*',
} as const;

export const HEADER = {
  H_MOBILE: 80,
  H_DESKTOP: 80,
  H_DESKTOP_OFFSET: 80 - 16,
};

export const AUTH_LINKS = {
  SIGN_IN_LINK: '/auth/login',
  UNAUTHORIZED: '/unauthorized',
};

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: ROUTES.main.dashboard,
  },
  {
    label: 'Resumes',
    path: ROUTES.main.resumes,
  },
];

export const PROFILE_POPOVER_OPTIONS = [
  {
    label: 'Profile',
    linkTo: ROUTES.main.profile,
  },
  {
    label: 'Settings',
    linkTo: '#',
  },
];

export const PASSWORD = 'password';

export enum FIELD_TYPE {
  text = 'text',
  email = 'email',
  number = 'number',
  phone = 'phone',
  select = 'select',
  password = 'password',
  checkbox = 'checkbox',
  autoComplete = 'autoComplete',
  switch = 'switch',
  maskedInput = 'maskedInput',
}

export const SIGN_UP_FIELDS: FormField[] = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Full Name',
    label: 'Full Name',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email address',
    label: 'Email address',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    label: 'Password',
  },
  {
    name: 'role',
    type: 'select',
    placeholder: 'Role',
    label: 'Role',
    options: [
      {
        label: UserRoleEnum.APPLICANT,
        value: UserRoleEnum.APPLICANT,
      },
      {
        label: UserRoleEnum.RECRUITER,
        value: UserRoleEnum.RECRUITER,
      },
    ],
  },
];

export const LOGIN_FIELDS: FormField[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email address',
    label: 'Email address',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    label: 'Password',
  },
];

// TODO: Move this to env file before integration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API Endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/signup',
  },
};

// Query Keys
export const API_QUERY_KEYS = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;
