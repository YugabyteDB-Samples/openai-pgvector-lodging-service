package com.lodging.service.service;

import java.util.List;
import java.util.Map;

import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.core.simple.JdbcClient.StatementSpec;
import org.springframework.stereotype.Service;

import com.lodging.service.model.Place;

@Service
public class EmbeddingService {
    private JdbcClient jdbcClient;

    private EmbeddingClient aiClient;

    @Autowired
    public EmbeddingService(JdbcClient jdbcClient, EmbeddingClient aiClient) {
        this.jdbcClient = jdbcClient;
        this.aiClient = aiClient;
    }

    public List<Place> searchInPostgres(String prompt, float matchThreshold, int matchCnt) {
        List<Double> promptEmbedding = aiClient.embed(prompt);

        StatementSpec query = jdbcClient.sql(
                "SELECT name, description, price, 1 - (description_embedding <=> :user_promt::vector) as similarity " +
                        "FROM airbnb_listing WHERE 1 - (description_embedding <=> :user_promt::vector) > :match_threshold "
                        +
                        "ORDER BY description_embedding <=> :user_promt::vector LIMIT :match_cnt")
                .param(Map.of("user_promt", promptEmbedding.toString(), "match_threshold", matchThreshold,
                        "match_cnt", matchCnt));

        return query.query(Place.class).list();
    }
}
