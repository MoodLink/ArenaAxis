package com.arenaaxis.userservice.entity.enums;

import lombok.Getter;

@Getter
public enum Role {
    ADMIN(1), CLIENT(2), USER(3);

    final int code;
    Role(int code) {
        this.code = code;
    }
}
