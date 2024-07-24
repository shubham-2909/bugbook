import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <>{children}</>;
}
