export interface UserContact {
  whatsapp?: string;
  facebookMessenger?: string;
  instagram?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeUserContact(raw: any): UserContact {
  if (!raw || typeof raw !== 'object') return {};
  const whatsapp = raw.WhatsApp ?? raw.whatsapp;
  const facebookMessenger = raw.FacebookMessenger ?? raw.facebookMessenger;
  const instagram = raw.Instagram ?? raw.instagram;
  return {
    ...(whatsapp ? { whatsapp: String(whatsapp) } : {}),
    ...(facebookMessenger ? { facebookMessenger: String(facebookMessenger) } : {}),
    ...(instagram ? { instagram: String(instagram) } : {}),
  };
}
