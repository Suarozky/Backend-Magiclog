import { Module } from '@nestjs/common';
import { AuthModule } from '../../token/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { userRepositoryProvider } from '../../database/postgres/providers/user.providers';
import { JwtStrategy } from '../../token/jwt.strategy';
import { UserService } from './user.service';
import { roleRepositoryProvider } from '../../database/postgres/providers/role.providers';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    UserService,
    JwtStrategy,
    ...roleRepositoryProvider,
    ...userRepositoryProvider,
  ],
  controllers: [UserController],
})
export class UserModule {}
