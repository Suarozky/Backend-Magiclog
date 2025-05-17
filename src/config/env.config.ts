// src/config/env.config.ts
import * as dotenv from 'dotenv';


dotenv.config(); 

export const EnvConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.APP_PORT ?? 3100,
  databaseHost: process.env.DATABASE_HOST ?? 'switchback.proxy.rlwy.net',
  databasePort: parseInt(process.env.DATABASE_PORT ?? '25696', 10),
  databaseUsername: process.env.DATABASE_USERNAME ?? 'postgres',
  databasePassword: process.env.DATABASE_PASSWORD ?? 'UeWcRvzokuheSuyKgKYYFiqllKhucnzI',
  databaseName: process.env.DATABASE_NAME ?? 'railway',
};
