export interface IAccount {
  id?: number,
  email: string,
  fName: string,
  lName: string,
  password: string,
  //todo
  // posts?: IPost[],
// comments?: IComments[]
}

export interface IAccountLogin {
  email: string,
  password: string,
}

