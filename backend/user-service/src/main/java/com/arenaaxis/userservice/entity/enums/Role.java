package com.arenaaxis.userservice.entity.enums;

import lombok.Getter;

@Getter
public enum Role {
    ADMIN(1, true), CLIENT(2, false), USER(3, false);

    final int code;
    final boolean isAdmin;
    Role(int code, boolean isAdmin) {
        this.code = code;
        this.isAdmin = isAdmin;
    }
}
