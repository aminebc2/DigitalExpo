package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.RequestStatus;

public class UpdateRequestStatusDTO {

    private Long requestId;
    private RequestStatus status;

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}
