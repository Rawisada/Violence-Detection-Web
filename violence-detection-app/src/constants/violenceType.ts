export const VIOLENCE_TYPES: Record<number, string> = {
    1: "Critical",
    2: "High",
    3: "Medium",
    4: "Low",
  };

export const PERSON_TYPES: Record<number, string> = {
    0: "None",
    1: "Child",
    2: "Adult",
    3: "Human" ,
};

export const COLOR_MAP: Record<number, string> = {
  1: "#1976d2", 
  2: "#4fc3f7", 
  3: "#98cae1", 
  4: "#90a4ae",
};

export const VIOLENCE_OPTIONS = Object.entries(VIOLENCE_TYPES).map(([key, value]) => ({
    id: Number(key),
    label: value,
}));


export const getViolencePeron = (labels: string[]): number[] => {
  const unique = [...new Set(labels)];
  const persons: number[] = [];

  if (unique.includes("Child")) persons.push(1);  // Child
  if (unique.includes("Adult")) persons.push(2);  // Adult
  if (unique.includes("Human")) persons.push(3);  // Human

  if (persons.length === 0) persons.push(0); // Unknown

  return persons;
};


export function getViolenceType(roles: string[]): number {
  const hasChild = roles.includes('Child');
  const hasAdult = roles.includes('Adult');
  const hasHuman = roles.includes('Human');

  if (hasChild && hasAdult) {
    return 1;
  }

  if (
    (hasChild && hasHuman) ||
    (hasAdult && hasHuman) ||
    (roles.filter(r => r === 'Human').length >= 2)
  ) {
    return 2;
  }

  if (hasChild || hasAdult) {
    return 3;
  }

  return 4;
}
