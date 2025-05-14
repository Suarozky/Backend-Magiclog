import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from '../../token/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { AuthService } from './auth.service';
import { userRepositoryProvider } from '../../database/postgres/providers/user.providers';
import { JwtStrategy } from '../../token/jwt.strategy';
import { roleRepositoryProvider } from '../../database/postgres/providers/role.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    AuthService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...roleRepositoryProvider,
  ],
  controllers: [AuthController],
})
export class AppAuthModule {}
