import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './postgres.config';
import { EnvConfig } from '../../config/env.config'; 

console.log('🧪 EnvConfig:', getDatabaseConfig());
console.log('🛠️ isProduction:', EnvConfig.isProduction);

// ⚠️ Export statement should be last
export default new DataSource(getDatabaseConfig());