import { Module } from '@nestjs/common';
import { AuthModule } from '../../token/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { JwtStrategy } from '../../token/jwt.strategy';
import { userRepositoryProvider } from '../../database/postgres/providers/user.providers';
import { CartController } from './cart.controller';
import { cartRepositoryProviders } from '../../database/postgres/providers/cart.providers';
import { CartService } from './cart.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    CartService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...cartRepositoryProviders,
  ],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}