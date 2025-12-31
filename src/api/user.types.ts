export interface Who {
  id: number;
  username: string;
  avatar?: string;
  nickname?: string;
  emailAddress: string;
}

/**
 * 更新用户信息`dto`
 */
export interface UpdateUserInput {
  nickname: string;
  avatar?: string | null;
}
