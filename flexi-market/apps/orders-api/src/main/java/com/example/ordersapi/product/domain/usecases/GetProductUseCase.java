package com.example.ordersapi.product.domain.usecases;

import org.springframework.stereotype.Service;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;
import com.example.ordersapi.product.domain.ports.in.GetProductPort;
import com.example.ordersapi.product.domain.ports.out.GetProductProvider;

@Service
public class GetProductUseCase implements GetProductPort
{
    private final GetProductProvider getProductProvider;

    public GetProductUseCase(GetProductProvider getProductProvider)
    {
        this.getProductProvider = getProductProvider;
    }

    @Override
    public Product getProduct(Long id) throws ProductException
    {
        return getProductProvider.getProduct(id);
    }
}
