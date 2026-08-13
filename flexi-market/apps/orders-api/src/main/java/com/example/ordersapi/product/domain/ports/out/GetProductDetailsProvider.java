package com.example.ordersapi.product.domain.ports.out;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;

public interface GetProductDetailsProvider
{
    Product getProductDetails(Long id) throws ProductException;
}
