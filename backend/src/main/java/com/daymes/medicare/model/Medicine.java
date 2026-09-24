package com.daymes.medicare.model;

import java.util.List;

/**
 * Represents a medicine product.
 */
public class Medicine {
    private String id;
    private String name;
    private String genericName;
    private String form;
    private List<String> aliases;
    private String category;
    private double price;
    private double rating;
    private int reviews;
    private boolean requiresRx;
    private String image;
    private String description;
    private String purpose;
    private String dosage;
    private String precautions;
    private String sideEffects;
    private String drugInteractions;
    private int stock;

    public Medicine() {}

    public Medicine(String id, String name, String genericName, String form, List<String> aliases, String category, double price, double rating, int reviews, boolean requiresRx, String image, String description, String purpose, String dosage, String precautions, String sideEffects, String drugInteractions, int stock) {
        this.id = id;
        this.name = name;
        this.genericName = genericName;
        this.form = form;
        this.aliases = aliases;
        this.category = category;
        this.price = price;
        this.rating = rating;
        this.reviews = reviews;
        this.requiresRx = requiresRx;
        this.image = image;
        this.description = description;
        this.purpose = purpose;
        this.dosage = dosage;
        this.precautions = precautions;
        this.sideEffects = sideEffects;
        this.drugInteractions = drugInteractions;
        this.stock = stock;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }
    public List<String> getAliases() { return aliases; }
    public void setAliases(List<String> aliases) { this.aliases = aliases; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviews() { return reviews; }
    public void setReviews(int reviews) { this.reviews = reviews; }
    public boolean isRequiresRx() { return requiresRx; }
    public void setRequiresRx(boolean requiresRx) { this.requiresRx = requiresRx; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getPrecautions() { return precautions; }
    public void setPrecautions(String precautions) { this.precautions = precautions; }
    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }
    public String getDrugInteractions() { return drugInteractions; }
    public void setDrugInteractions(String drugInteractions) { this.drugInteractions = drugInteractions; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    @Override
    public String toString() { return "Medicine{id='" + id + "', name='" + name + "'}"; }
}
