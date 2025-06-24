export interface DataResponse<M> {
  valid: boolean;
  data: M;
  message: string;
  status?: string;
}
