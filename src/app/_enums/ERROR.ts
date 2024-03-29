export enum ERROR {
  //em
//error messages


  HTTP_ERROR='ERROR: There was an error connecting to the server',

  //account
  ACCOUNT_NULL = "ERROR: Account does not exist",

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

  //post list
  POST_LIST_HTTP_ERROR = 'ERROR: There was an error with the server. Please try again later.',

  //post
  POST_NULL = 'ERROR: There was an issue loading this post. Please try again later.',
  POST_ACCOUNT_NULL = 'ERROR: Select account is not valid.',
  POST_HTTP_ERROR= 'ERROR: There was an error with the server. Please try again later.',
  POST_TITLE_EMPTY= 'ERROR: Post title must not be empty',
  POST_BODY_EMPTY= 'ERROR: Post body must not be empty',

  //comment
  COMMENT_BLANK =  'ERROR: Comment is blank',
  COMMENT_NULL = 'ERROR: Comment is null',
  COMMENT_ERROR= 'ERROR: There was an error posting this comment',
  COMMENT_HTTP_ERROR = 'ERROR: There was an error with the server. Please try again later.',

  //message
  MESSAGE_NULL = 'ERROR: Something went wrong',

}
