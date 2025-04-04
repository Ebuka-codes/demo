export interface LoginType {
  username: string;
  password: string;
}
export interface CorporateDto {
  corporateInfo: {
    name: string;
  };
  userDTO: {
    firstName: string;
    lastName: string;
    email: string;
    otp: string;
    password: string;
    phoneNumber: string;
  };
}
export interface User {
  id: string;
  name: string;
  role: string;
}
export interface Otp {
  email: string;
  phoneNumber: string;
}
