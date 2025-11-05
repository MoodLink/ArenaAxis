export const generateDurations = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const durations = [];
  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const nextHour = currentMinute + 30 >= 60 ? currentHour + 1 : currentHour;
    const nextMinute = (currentMinute + 30) % 60;

    durations.push({ startAt: { hour: currentHour, minute: currentMinute }, endAt: { hour: nextHour, minute: nextMinute } });

    currentHour = nextHour;
    currentMinute = nextMinute;
  }

  return durations;
};

export const joinDurations = (pricings) => {
  if (!pricings || pricings.length === 0) return [];

  pricings.sort((a, b) => {
    if (a.startAt.hour !== b.startAt.hour) {
      return a.startAt.hour - b.startAt.hour;
    }
    return a.startAt.minute - b.startAt.minute;
  });

  const result = [];
  let currentGroup = {
    specialPrice: pricings[0].specialPrice,
    startAt: { ...pricings[0].startAt },
    endAt: { ...pricings[0].endAt }
  };

  for (let i = 1; i < pricings.length; i++) {
    const current = pricings[i];
    
    if (current.specialPrice === currentGroup.specialPrice &&
        current.startAt.hour === currentGroup.endAt.hour &&
        current.startAt.minute === currentGroup.endAt.minute) {
      currentGroup.endAt = { ...current.endAt };
    } else {
      result.push({
        specialPrice: currentGroup.specialPrice,
        startAt: formatTime(currentGroup.startAt),
        endAt: formatTime(currentGroup.endAt)
      });
      currentGroup = {
        specialPrice: current.specialPrice,
        startAt: { ...current.startAt },
        endAt: { ...current.endAt }
      };
    }
  }

  result.push({
    specialPrice: currentGroup.specialPrice,
    startAt: formatTime(currentGroup.startAt),
    endAt: formatTime(currentGroup.endAt)
  });

  return result;
};

export const formatTime = (time) => {
  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");
  return `${hour}:${minute}`;
};
