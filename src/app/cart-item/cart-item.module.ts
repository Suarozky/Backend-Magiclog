
import { Module } from '@nestjs/common';
import { AuthModule } from '../../token/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { JwtStrategy } from '../../token/jwt.strategy';
import { userRepositoryProvider } from '../../database/postgres/providers/user.providers';
import { CartItemController } from './cart-item.controller';
import { productRepositoryProviders } from '../../database/postgres/providers/product.providers';
import { cartRepositoryProviders } from '../../database/postgres/providers/cart.providers';
import { cartItemRepositoryProvider } from '../../database/postgres/providers/cart-item.providers';
import { CartItemService } from './cart-item.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [AuthModule, DatabaseModule, CartModule],
  providers: [
    CartItemService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...productRepositoryProviders,
    ...cartItemRepositoryProvider,
    ...cartRepositoryProviders,
  ],
  controllers: [CartItemController],
})
export class CartItemModule {}
