import pino from 'pino';

import { LOG_LEVEL, NODE_ENV } from '@/constants/environments';

const pinoLogger = pino({
   level: LOG_LEVEL,
   transport:
      NODE_ENV === 'development'
         ? {
              target: 'pino-pretty',
              options: { colorize: true },
           }
         : undefined,
});

export { pinoLogger };
