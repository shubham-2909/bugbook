"use client";

import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function FollowerCount({
  userId,
  initialState,
}: {
  userId: string;
  initialState: FollowerInfo;
}) {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
