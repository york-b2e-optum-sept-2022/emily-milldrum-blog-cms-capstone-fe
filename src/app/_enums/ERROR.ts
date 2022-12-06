export enum ERROR {
//error messages

  //login
  LOGIN_INVALID = "ERROR: Login is invalid",
  LOGIN_BLANK = "ERROR: Please fill in both login fields",
  LOGIN_HTTP_ERROR = "ERROR: Unable to login, try again",

  //register
  REGISTER_INVALID_EMAIL_MESSAGE = "ERROR: You must provide a valid email",
  REGISTER_INVALID_EMAIL_UNIQUE_MESSAGE = "ERROR: This email has already been used",
  REGISTER_INVALID_FIRST_NAME_MESSAGE = "ERROR: You must provide a first name",
  REGISTER_INVALID_LAST_NAME_MESSAGE = "ERROR: You must provide a last name",
  REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE = "ERROR: Password must be at least 4 characters",
  REGISTER_INVALID_PASSWORD_MATCH = "ERROR: Passwords do not match",
  REGISTER_HTTP_ERROR_MESSAGE = 'ERROR: Unable to create your account, please try again later',

  //post
  POSTLIST_HTTP_ERROR = 'ERROR: There was an error with the server. Please try again later',

}
