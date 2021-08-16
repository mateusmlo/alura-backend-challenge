import { Logger } from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';

const logger = new Logger();

export const redisAuth = () => ({
  redisAuth: {
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    auth_pass: process.env.REDIS_PASS,
    db: parseInt(process.env.REDIS_DB),
    ttl: parseInt(process.env.REDIS_TTL),
    redisExpireTime: parseInt(process.env.REDIS_EXPIRE_TIME),
    enableReadyCheck: true,
    onClientReady: (client) => {
      client.on('error', (err) => {
        logger.error(
          `❌ Não é possível se conectar ao Redis; o servidor pode estar offline.`,
          err.message,
        );
      });
    },
  },
});
