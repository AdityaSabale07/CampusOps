package com.campusops.models;

import java.time.LocalDate;

public class DiscountDTO {

    private int id;
    private String name;
    private String type;
    private String description;
    private double value;
    private String mode;
    private LocalDate startDate;
    private LocalDate endDate;

    // ===== Constructors =====

    public DiscountDTO() {}

	public DiscountDTO(int id, String name, String type, String description, double value, String mode,
			LocalDate startDate, LocalDate endDate) {
		super();
		this.id = id;
		this.name = name;
		this.type = type;
		this.description = description;
		this.value = value;
		this.mode = mode;
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

 
}