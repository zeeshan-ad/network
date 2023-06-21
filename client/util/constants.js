export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
export const theme = {
  colors: {
    primary: '#A480F2',
    secondary: '#72E16E',
    info: '#2E8CED',
    danger: '#F44D4C',
    warning: '#F5C400',
    accent: '#F4ABAD',
    grey: '#b9b9b9',
    light: '#f2ecde',
    darkgrey: '#444',
    dark: '#0A0A0A',
    disabled: '#4c9648',
    divider: '#DEDEDE',
    textPost: '#F9F9F3',
    backdrop: 'rgba(0,0,0,0.6)'
  }
}

export const fontWeights = {
  light: 400,
  normal: 500,
  semibold: 600,
  bold: 700,
}

export const fontSizes = {
  small: 12,
  smallMedium: 14,
  medium: 16,
  large: 18,
  yeetPosts: 22,
  xlarge: 28,
  heading: 24,
  smallHightlight: 35,
  BigHightlight: 42,
  Logo: 70,
}
export const BASE_URL = 'http://192.168.0.188:3000';
export const APP_NAME = 'Yeet!';
