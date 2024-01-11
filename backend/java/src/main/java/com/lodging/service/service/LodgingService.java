package com.lodging.service.service;

import java.util.List;

import com.lodging.service.model.Place;

public interface LodgingService {
    public List<Place> searchPlaces(String prompt);
}
