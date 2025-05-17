import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthModule } from './auth/auth.module';
import {UserModule} from './user/user.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AppAuthModule,
    UserModule,
    CartModule,
    CartItemModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
