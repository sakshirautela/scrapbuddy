package com.junkbox.backend.entity;

public enum RoleNameEnum {
    ADMIN(1),
    USER(2),
    SELLER(3);
    public final int roleID;
    RoleNameEnum(int roleID) {
        this.roleID=roleID;
    }
    public int getRoleID() {
        return roleID;
    }
    public  String getRoleName() {
        return  name();
    }
    public static RoleNameEnum getRoleName(int roleID) {
        for (RoleNameEnum roleName : RoleNameEnum.values()) {
            if (roleName.getRoleID() == roleID) {
                return roleName;
            }
        }
        throw new IllegalArgumentException("Invalid role Id "+roleID);
    }
}
