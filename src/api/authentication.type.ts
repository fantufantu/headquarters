export interface LoginBy {
  who: string
  password: string
}

export interface RegisterBy {
  emailAddress: string
  avatar?: string
  username: string
  password: string
  captcha: string
}

export interface Who {
  id: number
  username: string
  avatar?: string
  nickname?: string
  emailAddress: string
}

export interface SendCaptchaBy {
  to: string
}
