package com.arenaaxis.userservice.utility;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeFormatter {
  public static final String DATE_STRING_FORMAT_DEFAULT = "yyyy-MM-dd";

  private static final DateTimeFormatter DATE_FORMATTER_DEFAULT =
    DateTimeFormatter.ofPattern(DATE_STRING_FORMAT_DEFAULT);

  private TimeFormatter() {}

  public static String convertDateFormatToString(LocalDateTime time) {
    return time == null ? null : time.format(DATE_FORMATTER_DEFAULT);
  }
}
