package com.amine.digiexpo.DTO;

public class AssociationRequest {
    private String username;
    private String email;
    private String password;
    private String name;
    private String ville;
    private String responsableName;
    private String responsablePhone;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getResponsableName() {
        return responsableName;
    }

    public void setResponsableName(String responsableName) {
        this.responsableName = responsableName;
    }

    public String getResponsablePhone() {
        return responsablePhone;
    }

    public void setResponsablePhone(String responsablePhone) {
        this.responsablePhone = responsablePhone;
    }
}