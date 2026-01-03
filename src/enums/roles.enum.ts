export const Roles = {
  ADMIN: "ADMIN",
  CAJERO: "CAJERO",
  MESERO: "MESERO",
  BARTENDER: "BARTENDER",
  COCINERO: "COCINERO",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
