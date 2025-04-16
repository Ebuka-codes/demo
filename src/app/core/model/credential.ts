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

export const CORP_KEY: string | null = localStorage.getItem('CorpKey');

export const AUTHORIZATION_HEADER: string = 'Authorization';

export const BEARER: string = 'Bearer';
