export const defaultSupportSettings = {
  phone: "+91 98765 43210",
  email: "hello@scrapify.in",
  address: "Greater Noida, Uttar Pradesh",
  helpTitle: "Need Help?",
  helpMessage: "Our support team is here to help you.",
  buttonText: "Contact Support",
};

const STORAGE_KEY = "scrapifySupportSettings";

export const getSupportSettings = () => {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

    return {
      ...defaultSupportSettings,
      ...(savedSettings || {}),
    };
  } catch {
    return defaultSupportSettings;
  }
};

export const saveSupportSettings = (settings) => {
  const nextSettings = {
    ...defaultSupportSettings,
    ...settings,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
  window.dispatchEvent(new Event("support-settings-updated"));

  return nextSettings;
};

export const getSupportPhoneHref = (phone) =>
  `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;

export const getSupportEmailHref = (email) =>
  `mailto:${String(email || "").trim()}`;
