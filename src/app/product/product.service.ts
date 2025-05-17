import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../../database/postgres/entities/product.entity';
import {
  CreateProductDto,
  ListaProductosResponse,
  UpdateProductDto,
} from '../../models/product/product.dto';
import { User } from '../../database/postgres/entities/user.entity';
import { ProductFiltersDto } from '../../models/product/product.interface';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async skuValidation(sku: string) {
    const existingProduct = await this.productRepository.findOne({
      where: { sku },
    });

    if (existingProduct) {
      throw new BadRequestException('A product with this SKU already exists.');
    }
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'], // Incluye la relación con el usuario
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async getProducts(
    filters: ProductFiltersDto,
  ): Promise<ListaProductosResponse> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Unir con la entidad 'user' y seleccionar los campos necesarios
    queryBuilder
      .leftJoinAndSelect('product.user', 'user')
      .select([
        'product.id',
        'product.name',
        'product.sku',
        'product.quantity',
        'product.price',
        'product.image',
        'product.created_at',
        'user.id',
        'user.email',
      ]);

    // Filtros por nombre
    if (filters.name) {
      queryBuilder.andWhere('product.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    // Filtros por SKU
    if (filters.sku) {
      queryBuilder.andWhere('product.sku = :sku', { sku: filters.sku });
    }

    if (filters.image) {
      queryBuilder.andWhere('product.image = :image');
    }

    // Filtro por cantidad
    if (filters.quantity) {
      queryBuilder.andWhere('product.quantity = :quantity', {
        quantity: filters.quantity,
      });
    }

    // Filtro por precio mínimo
    if (filters.priceMin) {
      queryBuilder.andWhere('product.price >= :priceMin', {
        priceMin: filters.priceMin,
      });
    }

    // Filtro por precio máximo
    if (filters.priceMax) {
      queryBuilder.andWhere('product.price <= :priceMax', {
        priceMax: filters.priceMax,
      });
    }

    // Filtro por userIds (ahora acepta un array de IDs)
    if (filters.userIds && filters.userIds.length > 0) {
      queryBuilder.andWhere('product.userId IN (:...userIds)', {
        userIds: filters.userIds,
      });
    }

    // Filtro por fecha de creación (desde)
    if (filters.createdAtFrom) {
      queryBuilder.andWhere('product.created_at >= :createdAtFrom', {
        createdAtFrom: filters.createdAtFrom,
      });
    }

    // Filtro por fecha de creación (hasta)
    if (filters.createdAtTo) {
      queryBuilder.andWhere('product.created_at <= :createdAtTo', {
        createdAtTo: filters.createdAtTo,
      });
    }

    // Aplicar paginación
    if (filters.page && filters.limit) {
      queryBuilder.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    // Obtener los resultados
    const [products, total] = await queryBuilder.getManyAndCount();

    // Calcular la paginación
    const perPage = filters.limit ?? 10;
    const currentPage = filters.page ?? 1;
    const lastPage = Math.ceil(total / perPage);
    const metadata = {
      total,
      per_page: perPage,
      current_page: currentPage,
      last_page: lastPage,
      next_page_url:
        currentPage < lastPage ? `/products?page=${currentPage + 1}` : null,
      prev_page_url:
        currentPage > 1 ? `/products?page=${currentPage - 1}` : null,
    };

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        image: product.image,
        price: product.price,
        createdAt: product.created_at.toISOString(),
        user: {
          id: product.user.id,
          email: product.user.email,
        },
      })),
      metadata,
    };
  }

  getProductsByUserId(userId: number) {
    return this.productRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async createProduct(product: CreateProductDto, userId: number) {
    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 3. Verificar si el producto con el mismo SKU ya existe
    const existingProduct = await this.productRepository.findOne({
      where: { sku: product.sku },
    });

    if (existingProduct) {
      throw new BadRequestException('A product with this SKU already exists.');
    }

    // 4. Validación de los campos del producto
    if (
      !product.name ||
      !product.sku ||
      product.quantity <= 0 ||
      product.price <= 0
    ) {
      throw new BadRequestException(
        'Product name, SKU, quantity, and price are required, and quantity and price must be greater than 0.',
      );
    }

    // 5. Crear el nuevo producto
    const newProduct = this.productRepository.create({
      ...product,
      user: { id: userId },
      // Si ya viene imagen, la usamos; si no, generamos una
    });

    try {
      await this.productRepository.save(newProduct);
    } catch (error) {
      throw new BadRequestException('Error saving product: ' );
    }

    return newProduct;
  }

  async updateProduct(product: UpdateProductDto, userId: number) {
    const { id } = product;

    // 1. Verificar si el producto existe y pertenece al usuario
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['user'], // Incluye la relación con el usuario
    });

    if (!existingProduct) {
      throw new UnauthorizedException('Product not found.');
    }

    if (existingProduct.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this product.',
      );
    }

    // 2. Validación de los campos del producto
    if (product.quantity <= 0 || product.price <= 0) {
      throw new BadRequestException(
        'Quantity and price are required, and must be greater than 0.',
      );
    }

    // 3. Actualizar el producto
    try {
      await this.productRepository.update(id, product);
    } catch (error) {
      throw new BadRequestException('Error updating product: ' );
    }

    // 4. Devolver el producto actualizado
    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number, userId: number) {
    // 1. Verificar si el producto existe y pertenece al usuario
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['user'], // Incluye la relación con el usuario
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found.');
    }

    // 2. Verificar el rol del usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'], // Incluye la relación con el rol
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (!(user.role.id === 1) && !(existingProduct.user.id === userId)) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product.',
      );
    }

    // 4. Eliminar el producto
    try {
      await this.productRepository.softDelete(id);
    } catch (error) {
      throw new BadRequestException('Error deleting product: ');
    }

    return { message: 'Product deleted successfully.' };
  }
}
