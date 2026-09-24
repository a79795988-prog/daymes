package com.daymes.medicare.dto;

public class AuthResponse {
    private boolean success;
    private String token;
    private Object user;
    private String error;

    public AuthResponse() {}

    private AuthResponse(boolean success, String token, Object user, String error) {
        this.success = success;
        this.token = token;
        this.user = user;
        this.error = error;
    }

    public static AuthResponse success(String token, Object user) {
        return new AuthResponse(true, token, user, null);
    }

    public static AuthResponse error(String error) {
        return new AuthResponse(false, null, null, error);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Object getUser() { return user; }
    public void setUser(Object user) { this.user = user; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
