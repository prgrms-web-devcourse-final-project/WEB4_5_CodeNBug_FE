import { motion } from "motion/react";
import { MyInfoType } from "@/schemas/user.schema";
import { Button } from "@/components/ui/button";
import { InfoRow } from "./info-row";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { EditProfileDrawer } from "./edit-profile-drawer";

interface Props {
  me: MyInfoType;
}

export const ProfileCard = ({ me }: Props) => {
  return (
    <motion.section
      layout
      className="rounded-xl border bg-card p-6 shadow-sm dark:border-gray-700 flex flex-col gap-6 md:flex-row"
    >
      <Avatar className="mx-auto md:mx-0 shrink-0 w-28 h-28 rounded-full border">
        <AvatarFallback className="w-full h-full flex items-center justify-center bg-muted text-4xl font-bold select-none">
          {me.name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-3">
        <h1 className="text-2xl font-semibold">{me.name}님</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <InfoRow label="이메일" value={me.email} />
          <InfoRow label="전화번호" value={me.phoneNum} />
          <InfoRow label="성별" value={me.sex} />
          <InfoRow label="나이" value={`${me.age}세`} />
          <InfoRow label="지역" value={me.location} />
          <InfoRow
            label="가입일"
            value={new Date(me.createdAt).toLocaleDateString("ko-KR")}
          />
        </div>
        <div className="pt-4 flex gap-3">
          <EditProfileDrawer me={me} />
          <Button size="sm" variant="outline">
            로그아웃
          </Button>
        </div>
      </div>
    </motion.section>
  );
};
