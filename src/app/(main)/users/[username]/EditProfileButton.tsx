"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { EditProfileDialog } from "./EditProfileDialog";

interface Props {
  user: UserData;
}

export function EditProfileButton({ user }: Props) {
  const [showDialog, setshowDialog] = useState(false);

  return (
    <>
      <Button variant={`outline`} onClick={() => setshowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setshowDialog}
      />
    </>
  );
}
