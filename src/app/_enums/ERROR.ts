export enum ERROR {
//error messages

  LOGIN_INVALID = "Login is invalid",
  LOGIN_BLANK = "Please fill in both login fields",
  LOGIN_HTTP_ERROR = "Unable to login, try again",


  REGISTER_INVALID_EMAIL_MESSAGE = "You must provide a valid email",
  REGISTER_INVALID_EMAIL_UNIQUE_MESSAGE = "This email has already been used",
  REGISTER_INVALID_FIRST_NAME_MESSAGE = "You must provide a first name",
  REGISTER_INVALID_LAST_NAME_MESSAGE = "You must provide a last name",
  REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE = "Password must be at least 4 characters",
  REGISTER_INVALID_PASSWORD_MATCH = "Passwords do not match",
  REGISTER_HTTP_ERROR_MESSAGE = 'Unable to create your account, please try again later'

}
