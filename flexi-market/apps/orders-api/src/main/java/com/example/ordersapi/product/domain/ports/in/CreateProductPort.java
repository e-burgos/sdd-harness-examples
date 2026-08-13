package com.example.ordersapi.product.domain.ports.in;

import java.math.BigDecimal;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;

public interface CreateProductPort
{
    Product createProduct(String name, String category, BigDecimal price) throws ProductException;
}
