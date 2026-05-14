export interface RegisterDTO {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
