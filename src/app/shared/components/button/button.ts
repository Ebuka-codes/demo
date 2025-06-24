type buttonType = 'primary' | 'secondary' | 'ghost';

type buttonSize = 'small' | 'medium' | 'large';

type customClass = `${buttonType}-btn ${buttonSize}-btn`;

export interface ButtonConfig {
  text: string;
  type?: 'submit' | 'button' | 'reset';
  customClass: string | customClass;
  isDisabled?: boolean;
  icon?: string;
  isLoading?: boolean;
}
