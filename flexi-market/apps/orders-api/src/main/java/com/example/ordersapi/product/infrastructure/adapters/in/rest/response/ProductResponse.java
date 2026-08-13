package com.example.ordersapi.product.infrastructure.adapters.in.rest.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProductResponse
{
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private String description;

    public static ProductResponse from(com.example.ordersapi.product.domain.models.Product product)
    {
        return ProductResponse.builder().id(product.getId()).name(product.getName()).category(product.getCategory())
                .price(product.getPrice()).description(product.getDescription()).build();
    }
}
