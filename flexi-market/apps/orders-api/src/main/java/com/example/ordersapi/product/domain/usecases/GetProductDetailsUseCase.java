package com.example.ordersapi.product.domain.usecases;

import org.springframework.stereotype.Service;

import com.example.ordersapi.product.domain.exception.ProductException;
import com.example.ordersapi.product.domain.models.Product;
import com.example.ordersapi.product.domain.ports.in.GetProductDetailsPort;
import com.example.ordersapi.product.domain.ports.out.GetProductDetailsProvider;

@Service
public class GetProductDetailsUseCase implements GetProductDetailsPort
{
    private final GetProductDetailsProvider getProductDetailsProvider;

    public GetProductDetailsUseCase(GetProductDetailsProvider getProductDetailsProvider)
    {
        this.getProductDetailsProvider = getProductDetailsProvider;
    }

    @Override
    public Product getProductDetails(Long id) throws ProductException
    {
        return getProductDetailsProvider.getProductDetails(id);
    }
}
