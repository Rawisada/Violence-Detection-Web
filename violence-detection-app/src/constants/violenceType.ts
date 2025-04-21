export const VIOLENCE_TYPES: Record<number, string> = {
    1: "Child - Adult",
    2: "Adult - Adult",
    3: "Child - Child" ,
  };

export const VIOLENCE_OPTIONS = Object.entries(VIOLENCE_TYPES).map(([key, value]) => ({
    id: Number(key),
    label: value,
}));