export const getRoleBasedRedirect = (role: string): string => {
  const redirectMap: Record<string, string> = {
    ADMIN: "/",
    CAJERO: "/cashier",
    MESERO: "/tables",
    BARTENDER: "/bar",
    COCINERO: "/kitchen",
  };
  return redirectMap[role] || "/";
};
