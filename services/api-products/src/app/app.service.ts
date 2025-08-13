import { Injectable } from '@nestjs/common';
import { Product } from '@my-microservices/shared-types';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AppService {
  private products: Product[] = [
    { id: '1', name: 'Organic Rice', category: 'grain', price: 500, location: 'Bangkok' },
    { id: '2', name: 'Dried Mango', category: 'fruit', price: 120, location: 'Chiang Mai' },
  ];
  private nextId = 3;

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(dto: CreateProductDto): Product {
    const product: Product = { id: `${this.nextId++}`, ...dto };
    this.products.push(product);
    return product;
  }

  updateProduct(id: string, dto: UpdateProductDto): Product | undefined {
    const product = this.getProduct(id);
    if (product) {
      Object.assign(product, dto);
    }
    return product;
  }

  deleteProduct(id: string): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index >= 0) {
      const [removed] = this.products.splice(index, 1);
      return removed;
    }
    return undefined;
  }
}
