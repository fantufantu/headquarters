export interface LoginInput {
  who: string;
  password: string;
}

export interface RegisterInput {
  emailAddress: string;
  avatar?: string;
  username?: string;
  password: string;
  captcha: string;
}

export interface Who {
  id: number;
  username: string;
  avatar?: string;
  nickname?: string;
  emailAddress: string;
}
