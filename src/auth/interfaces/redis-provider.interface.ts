interface IRedisProvider {
  validateRefreshToken(uuid: string, token: string): Promise<boolean>;

  saveRefreshTokenHash(
    expireTime: number,
    uuid: string,
    refreshToken: string,
  ): Promise<'OK' | null>;

  deleteKey(uuid: string): Promise<boolean>;
  getTokenHash(uuid: string): Promise<string>;

  compareStoredTokenAndReceived(token: string, hash: string);
}

export default IRedisProvider;
