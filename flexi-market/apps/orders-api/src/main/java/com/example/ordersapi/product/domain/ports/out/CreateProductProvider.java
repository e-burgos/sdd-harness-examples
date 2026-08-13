package com.example.ordersapi.product.domain.ports.out;

import com.example.ordersapi.product.domain.models.Product;

public interface CreateProductProvider
{
    Product save(Product product);

    boolean existsByName(String name);
}
