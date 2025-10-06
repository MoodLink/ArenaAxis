package com.arenaaxis.userservice.utility;

public class Constant {
  public static final String INVALID_EMAIL_MSG = "INVALID_EMAIL";
  public static final String INVALID_USER_NAME_MSG = "INVALID_NAME";
  public static final String INVALID_PASSWORD_MSG = "INVALID_PASSWORD";
  public static final String INVALID_PHONE_MSG = "INVALID_PHONE";
  public static final String INVALID_BANK_ACCOUNT_NUMBER_MSG = "INVALID_BANK_ACCOUNT_NUMBER";
  public static final String INVALID_BANK_ACCOUNT_NAME_MSG = "INVALID_BANK_ACCOUNT_NAME";

  public static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
  public static final String STRING_REGEX = "^[\\p{L} .'-]+$";
  public static final String NUMBER_REGEX = "^[0-9]+$";

  private Constant() {}
}
