package com.junkbox.backend.dto.response;

import com.junkbox.backend.entity.Categories;
import com.junkbox.backend.entity.SubCategories;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
public class CategoryWithSubCategoryResponse {
    HashMap<Categories, List<SubCategories>> subCategories = new HashMap<>();
}
