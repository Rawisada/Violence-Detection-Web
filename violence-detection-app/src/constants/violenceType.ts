export const VIOLENCE_TYPES: Record<number, string> = {
    1: "Child - Adult",
    2: "Child - Child",
    3: "Adult - Adult",
  };

export const VIOLENCE_OPTIONS = Object.entries(VIOLENCE_TYPES).map(([key, value]) => ({
    id: Number(key),
    label: value,
}));