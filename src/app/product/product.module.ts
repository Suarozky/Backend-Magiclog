import { Module } from '@nestjs/common';
import { AuthModule } from '../../token/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { productRepositoryProviders } from '../../database/postgres/providers/product.providers';
import { JwtStrategy } from '../../token/jwt.strategy';
import { ProductService } from './product.service';
import { ProductsController } from './product.controller';
import { userRepositoryProvider } from '../../database/postgres/providers/user.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    ProductService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...productRepositoryProviders,
  ],
  controllers: [ProductsController],
})
export class ProductModule {}