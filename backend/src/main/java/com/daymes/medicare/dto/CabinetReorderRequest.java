package com.daymes.medicare.dto;

import java.util.List;

public class CabinetReorderRequest {
    private List<String> itemIds;

    public List<String> getItemIds() { return itemIds; }
    public void setItemIds(List<String> itemIds) { this.itemIds = itemIds; }
}
