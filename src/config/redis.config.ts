import { Logger } from '@nestjs/common';

const logger = new Logger();

export const redisConfig = () => ({
  redisStore: {
    name: 'jwt',
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    db: 1,
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
