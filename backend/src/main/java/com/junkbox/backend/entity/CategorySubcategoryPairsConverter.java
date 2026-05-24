package com.junkbox.backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class CategorySubcategoryPairsConverter implements AttributeConverter<HashMap<Long, List<Long>>, String> {

    @Override
    public String convertToDatabaseColumn(HashMap<Long, List<Long>> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }

        return attribute.entrySet()
                .stream()
                .map((entry) -> entry.getKey() + ":" + formatSubCategoryIds(entry.getValue()))
                .collect(Collectors.joining(";"));
    }

    @Override
    public HashMap<Long, List<Long>> convertToEntityAttribute(String dbData) {
        HashMap<Long, List<Long>> result = new HashMap<>();

        if (dbData == null || dbData.trim().isEmpty()) {
            return result;
        }

        for (String pair : dbData.split(";")) {
            if (pair == null || pair.trim().isEmpty() || !pair.contains(":")) {
                continue;
            }

            String[] parts = pair.split(":", 2);

            try {
                Long categoryId = Long.parseLong(parts[0].trim());
                List<Long> subCategoryIds = parseSubCategoryIds(parts[1]);

                result.put(categoryId, subCategoryIds);
            } catch (NumberFormatException ignored) {
                // Ignore malformed persisted values so one bad pair does not break order reads.
            }
        }

        return result;
    }

    private String formatSubCategoryIds(List<Long> subCategoryIds) {
        if (subCategoryIds == null || subCategoryIds.isEmpty()) {
            return "";
        }

        return subCategoryIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    private List<Long> parseSubCategoryIds(String rawValue) {
        List<Long> subCategoryIds = new ArrayList<>();

        if (rawValue == null || rawValue.trim().isEmpty()) {
            return subCategoryIds;
        }

        for (String rawSubCategoryId : rawValue.split(",")) {
            if (rawSubCategoryId != null && !rawSubCategoryId.trim().isEmpty()) {
                subCategoryIds.add(Long.parseLong(rawSubCategoryId.trim()));
            }
        }

        return subCategoryIds;
    }
}
