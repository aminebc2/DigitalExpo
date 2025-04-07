package com.amine.digiexpo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


public class OurException extends RuntimeException {
    public OurException(String message) {
        super(message);
    }
}