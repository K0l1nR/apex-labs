export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d]+/g, '');
}

export function excludeExtraSymbols(str: string): string {
  return str.replace(/[^а-яА-Я\s-]/gi, '');
}

export function capitalizeName(str: string): string {
  return str.replace(/(^|\s|-)(\S)/g, (s) => s.toUpperCase());
}

export function formatName(name: string): string | null {
  if (!name) {
    return null;
  }
  const namelc = excludeExtraSymbols(name).trim().toLowerCase();

  return namelc ? capitalizeName(namelc) : null;
}
