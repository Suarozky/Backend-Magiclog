// src/databases/postgres/database.config.ts
import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from '../../config/env.config'; // Importar las variables de entorno
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

export const getDatabaseConfig = (): DataSourceOptions => ({
  host: EnvConfig.databaseHost,
  port: EnvConfig.databasePort,
  username: EnvConfig.databaseUsername,
  password: EnvConfig.databasePassword,
  database: EnvConfig.databaseName,
  synchronize: false,
  logging: false,
  dropSchema: false,
  type: 'postgres',
  maxQueryExecutionTime: 1000,
  entities: [User, Role],
  migrations: [
    EnvConfig.isProduction
      ? 'dist/src/database/postgres/migrations/*{.ts,.js}'
      : 'src/database/postgres/migrations/*{.ts,.js}',
  ],
  extra: {
    connectionLimit: 10,
  },
});