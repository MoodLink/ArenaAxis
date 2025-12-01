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

    durations.push({
      startAt: { hour: currentHour, minute: currentMinute },
      endAt: { hour: nextHour, minute: nextMinute },
    });

    currentHour = nextHour;
    currentMinute = nextMinute;
  }

  return durations;
};

export const generateDurationsDateTime = (startDateTime, endDateTime) => {
  // startDateTime và endDateTime định dạng "yyyy-mm-dd HH:mm"
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const durations = [];

  let current = new Date(start);
  while (current < end) {
    const next = new Date(current.getTime() + 30 * 60000);
    durations.push({
      startAt: new Date(current),
      endAt: new Date(next),
    });
    current = next;
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
    endAt: { ...pricings[0].endAt },
  };

  for (let i = 1; i < pricings.length; i++) {
    const current = pricings[i];

    if (
      current.specialPrice === currentGroup.specialPrice &&
      current.startAt.hour === currentGroup.endAt.hour &&
      current.startAt.minute === currentGroup.endAt.minute
    ) {
      currentGroup.endAt = { ...current.endAt };
    } else {
      result.push({
        specialPrice: currentGroup.specialPrice,
        startAt: formatTime(currentGroup.startAt),
        endAt: formatTime(currentGroup.endAt),
      });
      currentGroup = {
        specialPrice: current.specialPrice,
        startAt: { ...current.startAt },
        endAt: { ...current.endAt },
      };
    }
  }

  result.push({
    specialPrice: currentGroup.specialPrice,
    startAt: formatTime(currentGroup.startAt),
    endAt: formatTime(currentGroup.endAt),
  });

  return result;
};

export const joinDurationsDateTime = (pricings) => {
  if (!pricings || pricings.length === 0) return [];
  pricings.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  const result = [];
  let currentGroup = {
    specialPrice: pricings[0].specialPrice,
    startAt: new Date(pricings[0].startAt),
    endAt: new Date(pricings[0].endAt),
  };
  for (let i = 1; i < pricings.length; i++) {
    const current = pricings[i];
    if (
      current.specialPrice === currentGroup.specialPrice &&
      new Date(current.startAt).getTime() === currentGroup.endAt.getTime()
    ) {
      currentGroup.endAt = new Date(current.endAt);
    } else {
      result.push({
        specialPrice: currentGroup.specialPrice,
        startAt: new Date(currentGroup.startAt),
        endAt: new Date(currentGroup.endAt),
      });
      currentGroup = {
        specialPrice: current.specialPrice,
        startAt: new Date(current.startAt),
        endAt: new Date(current.endAt),
      };
    }
  }
  result.push({
    specialPrice: currentGroup.specialPrice,
    startAt: new Date(currentGroup.startAt),
    endAt: new Date(currentGroup.endAt),
  });
  return result;
};

export const formatTime = (time) => {
  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

export const mergeContinuous = (items) => {
  items.sort((a, b) => {
    if (a.field_id !== b.field_id) return a.field_id.localeCompare(b.field_id);
    return a.start_time.localeCompare(b.start_time);
  });

  const merged = [];
  let current = null;

  for (const item of items) {
    if (!current) {
      current = { ...item };
      continue;
    }

    if (
      current.field_id === item.field_id &&
      current.end_time === item.start_time
    ) {
      current.end_time = item.end_time;
      current.price += item.price;
    } else {
      merged.push(current);
      current = { ...item };
    }
  }

  if (current) merged.push(current);

  const result = merged.map((i) => ({
    name: i.name + `: (${i.start_time} - ${i.end_time})`,
    quantity: 1,
    price: i.price,
  }));

  return result;
};

export const mergeOrderDetails = (orderDetails) => {
  const sorted = [...orderDetails].sort((a, b) => {
    if (a.fieldId !== b.fieldId) return a.fieldId.localeCompare(b.fieldId);
    return new Date(a.startTime) - new Date(b.startTime);
  });

  const merged = [];
  let current = null;

  for (const item of sorted) {
    if (!current) {
      current = { ...item };
      continue;
    }

    if (
      current.fieldId === item.fieldId &&
      new Date(current.endTime).getTime() === new Date(item.startTime).getTime()
    ) {
      current.endTime = item.endTime;
      current.price += item.price;
    } else {
      merged.push(current);
      current = { ...item };
    }
  }

  if (current) merged.push(current);

  return merged.map((item) => ({
    fieldId: item.fieldId,
    startTime: formatDate(item.startTime),
    endTime: formatDate(item.endTime),
    price: item.price,
  }));
};

export const formatDate = (date) => {
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
};
