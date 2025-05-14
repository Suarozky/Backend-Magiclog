// src/database/postgres/typeorm.ts
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './postgres.config';

console.log('🧪 EnvConfig:', getDatabaseConfig());

// ⚠️ Aquí el export debe ser "default"
export default new DataSource(getDatabaseConfig());
