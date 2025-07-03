export interface LoginRequest {
  username: string;

  password: string;

  rememberMe?: boolean;
}

export interface UserToken {
  use2FA?: boolean;

  access_token?: string;

  expires_in?: number;

  refresh_expires_in?: number;

  refresh_token?: string;

  token_type?: string;

  scope?: string;

  status?: string;

  expiration?: number;
}

export class IUserToken implements UserToken {
  use2FA?: boolean;
  refresh_expires_in?: number;
  token_type?: string;
  status?: string;
  expiration?: number;
  accessToken?: string;

  refreshToken?: string;

  expiresIn?: number;

  scope?: string;

  set access_token(value: string) {
    this.accessToken = value;
  }

  set refresh_token(value: string) {
    this.refreshToken = value;
  }

  set expires_in(value: number) {
    this.expiresIn = value;
  }
}

export interface UserProfile {
  personalDetail: PersonalDetail;
  roles: any | null;
  companyDetail: CompanyDetail;
  currentCompanyDetail: CompanyDetail;
}
interface PersonalDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isDefaultUser: boolean;
  loginDate: string;
}

interface CompanyDetail {
  id: string;
  code: string | null;
  name: string;
  finPeriod: string | null;
}

export const USER_TOKEN_KEY: string = '$x35w-cPBfH';

export const CURRENT_CORPORATE_KEY: string = 'corp-key';

export const CORP_URL_KEY: string = 'c1r_pu9_x1';

export const AUTHORIZATION_HEADER: string = 'Authorization';

export const BEARER: string = 'Bearer';

export const JOB_ID_KEY = 'j8x_k92_jd';

export const CANDIATE_EMAIL = 'erecruit_candidate_email';
