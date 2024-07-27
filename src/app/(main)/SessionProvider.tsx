"use client";

"use client";

import { Session, User } from "lucia";
import { createContext, useContext } from "react";

type SessionProps = {
  user: User;
  session: Session;
};

export const SessionContext = createContext<SessionProps | null>(null);
export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionProps }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("Cant be called in components outside of the Context");
  }
  return context;
}
