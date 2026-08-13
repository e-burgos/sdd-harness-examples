package com.example.ordersapi.product.domain.ports.in;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;

public interface GetProductDetailsPort
{
    Product getProductDetails(Long id) throws ProductException;
}
