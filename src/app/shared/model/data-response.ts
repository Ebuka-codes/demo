import { Message, Severity } from './message';

export interface DataResponse<M> {
  valid: boolean;
  data: M;
  message: string;
  status?: string;
}

abstract class ResponseCode {
  static readonly SUCCESSFUL: string = '00';
  static readonly FAILED: string = '99';
}

export class IDataResponse<M> implements DataResponse<M> {
  totalRecords!: number;

  private _valid!: boolean;

  private _data!: M;

  private _message!: Message;

  private _responseData!: M;

  private _status!: string;

  private _responseMsg!: string;

  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    if (value && !this._status) {
      this._status = value ? ResponseCode.SUCCESSFUL : ResponseCode.FAILED;
    }
    this._valid = value;
  }

  get data(): M {
    return this._data;
  }

  set data(value: M) {
    if (value && !this._responseData) {
      this._responseData = value;
    }
    this._data = value;
  }

  get message(): string {
    return this._message.summary;
  }

  set messages(value: string) {
    if (value) {
      this._responseMsg = value;
    }
  }

  get responseData(): M {
    return this._responseData;
  }

  set responseData(value: M) {
    if (value && !this._data) {
      this._data = value;
    }
    this._responseData = value;
  }

  get responseMsg(): string {
    return this._responseMsg;
  }

  set responseMsg(value: string) {
    if (value && !this._message) {
      this._message = { summary: '', detail: value, severity: Severity.ERROR };
    }
    this._responseMsg = value;
  }
}
