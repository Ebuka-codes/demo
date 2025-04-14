import { enviroments } from 'src/environments/enviorments';
const BASE_URL = enviroments.API_URL;
export const Constants = {
  AUTH_URL: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/corporate/create`,
    MICROSOFT_LOGIN: '',
    GOOGLE_LOGIN: '',
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    VERIFICATION_OTP: `${BASE_URL}/auth/otp/sendotp`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${BASE_URL}/auth/getnewtoken`,
  },
  USER_URL: {
    USER: `${BASE_URL}/user`,
    USER_ROLE: `${BASE_URL}/api/user-roles`,
  },

  CANDIDATE_URL: {
    CANDIDATES: `${BASE_URL}/api/candidates`,
    SHORTLIST: `${BASE_URL}/api/candidates/shortlist-candidates`,
    FILTER_BY_QUALIFIED_QUESTION: `${BASE_URL}/api/candidates/filter-candidates-by-qualify-questions`,
    SEARCH_OPERAND: `${BASE_URL}/api/candidates/search-operand`,
  },

  INTERVIEW_URL: {
    INTERVIEWER: `${BASE_URL}/api/interview-invitees`,
  },
  CORPORATE_URL: {
    CORPORATE: `${BASE_URL}/api/corporates`,
  },
  JOB_URL: {
    JOB: `${BASE_URL}/api/job-details`,
  },
  QUERY_DETAILS_URL: {
    QUERY_DETAILS: `${BASE_URL}/api/query-details`,
  },
  QUESTION_OPTION_URL: {
    QUESTION_OPTIONS: `${BASE_URL}/api/question-options`,
    OPERATOR: `${BASE_URL}/api/question-options`,
  },

  FILTER_URL: {
    FILTER_JOB: `${BASE_URL}/api/filter/job`,
    FILTER_CANDIDATE: `${BASE_URL}/api/filter/candidate`,
  },
};
