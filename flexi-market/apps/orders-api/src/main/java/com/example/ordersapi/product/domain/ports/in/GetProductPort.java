package com.example.ordersapi.product.domain.ports.in;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;

public interface GetProductPort
{
    Product getProduct(Long id) throws ProductException;
}
