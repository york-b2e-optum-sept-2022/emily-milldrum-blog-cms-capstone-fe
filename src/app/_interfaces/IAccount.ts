export interface IAccount {
  id?: number,
  email: string,
  fName: string,
  lName: string,
  password: string,
  profilePic: string,
}

export interface IAccountLogin {
  email: string,
  password: string,
}

