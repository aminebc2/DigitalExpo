package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.SessionStatus;

public class SessionStatusUpdateDTO {
    private SessionStatus status;

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }
}
