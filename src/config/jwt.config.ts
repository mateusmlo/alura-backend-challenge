export const jwtConstants = () => ({
  jwtConstants: {
    accessTokenConstants: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    },
    refreshTokenConstants: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    },
  },
});
