export const formatAddress = ({
  city,
  streetName,
  streetNumber,
}: {
  streetName: string;
  streetNumber: string;
  city: string;
}) => {
  return `${streetName} ${streetNumber}, ${city}`;
};

type TDateValue = string | Date;

export const formatDate = (v: TDateValue) => {
  const date = new Date(v);
  if (isNaN(date as any)) {
    return '';
  }

  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();

  return `${String(day).padStart(2, '0')}.${String(month).padStart(
    2,
    '0',
  )}.${year}`;
};

export const formatTime = (v: TDateValue) => {
  const date = new Date(v);
  if (isNaN(date as any)) {
    return '';
  }

  const hours = date.getHours(),
    minutes = date.getMinutes();

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}`;
};

export const formatDatetime = (v: TDateValue) => {
  return `${formatDate(v)}/${formatTime(v)}`;
};

export const formatPhoneNumber = (v: string) => {
  if (!v) {
    return '';
  }

  return `${v.substring(0, 3)} ${v.substring(3, 6)} ${v.substring(
    6,
    9,
  )} ${v.substring(9, 12)}`;
};
