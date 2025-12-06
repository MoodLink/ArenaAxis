package com.arenaaxis.userservice.utility;

public class Constant {
  public static final String INVALID_EMAIL_MSG = "INVALID_EMAIL";
  public static final String INVALID_USER_NAME_MSG = "INVALID_NAME";
  public static final String INVALID_PASSWORD_MSG = "INVALID_PASSWORD";
  public static final String INVALID_PHONE_MSG = "INVALID_PHONE";
  public static final String INVALID_BANK_ACCOUNT_NUMBER_MSG = "INVALID_BANK_ACCOUNT_NUMBER";
  public static final String INVALID_BANK_ACCOUNT_NAME_MSG = "INVALID_BANK_ACCOUNT_NAME";

  public static final String NOT_BLANK_PASSWORD = "NOT_BLANK_PASSWORD";
  public static final String NOT_BLANK_EMAIL = "NOT_BLANK_EMAIL";
  public static final String NOT_BLANK_NAME = "NOT_BLANK_NAME";
  public static final String MIN_PASSWORD_MSG = "MIN_PASSWORD_MSG";

  public static final String NOT_BLANK_STORE_NAME = "NOT_BLANK_STORE_NAME";
  public static final String NOT_BLANK_STORE_ADDRESS = "NOT_BLANK_STORE_ADDRESS";
  public static final String INVALID_STORE_NAME = "INVALID_STORE_NAME";
  public static final String INVALID_LINK_GOOGLE_MAP = "INVALID_LINK_GOOGLE_MAP";

  public static final String NOT_BLANK_WARD_ID = "NOT_BLANK_WARD_ID";

  public static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$";
  public static final String STRING_REGEX = "^[\\p{L} .'-]*$";
  public static final String NUMBER_REGEX = "^[0-9]+$";
  public static final String NAME_STORE_REGEX = "^[\\p{L}0-9\\s'-]*$";
  public static final String LINK_GOOGLE_MAP_REGEX = "^((https?:\\/\\/)?(www\\.)?google\\.com\\/maps\\/.+@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+).*)?$";

  private Constant() {}
}
