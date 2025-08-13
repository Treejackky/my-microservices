import { Injectable } from '@nestjs/common';

interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  location: string;
}

@Injectable()
export class ProductsService {
  private readonly productServiceUrl =
    process.env.API_PRODUCTS_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'http://api-products:3002'
      : 'http://localhost:3002');

  async createProduct(dto: CreateProductDto) {
    const response = await fetch(`${this.productServiceUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts() {
    const response = await fetch(`${this.productServiceUrl}/api/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }

  async getProduct(id: string) {
    const response = await fetch(`${this.productServiceUrl}/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }

  async updateProduct(id: string, dto: Partial<CreateProductDto>) {
    const response = await fetch(`${this.productServiceUrl}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteProduct(id: string) {
    const response = await fetch(`${this.productServiceUrl}/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    return response.json();
  }
}
