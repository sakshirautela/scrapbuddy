// @ts-nocheck
export const formatDateTime = (value, options) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(options?.locale, options?.format);
};

export const formatIndianDateTime = (value) =>
  formatDateTime(value, {
    locale: "en-IN",
    format: {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

export const joinValues = (values) => {
  const filteredValues = values.filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  return filteredValues.length > 0 ? filteredValues.join(", ") : "-";
};

export const getAddressSummary = (address = {}) =>
  joinValues([
    [address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" "),
    address.receiverPhone,
    address.receiverEmail,
    address.apartment,
    address.city,
    address.state,
    address.zip,
    address.country,
    address.countryCode,
  ]);
