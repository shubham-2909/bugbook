import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  return <>{children}</>;
}
