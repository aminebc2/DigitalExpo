package com.amine.digiexpo.DTO;

import java.time.LocalDate;
import java.util.List;

public class DateListDTO {
    private List<LocalDate> dates;

    public List<LocalDate> getDates() {
        return dates;
    }

    public void setDates(List<LocalDate> dates) {
        this.dates = dates;
    }
}