import { motion } from "motion/react";
import { useMyInfo } from "@/services/query/user.query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/my/profile-card";
import { TicketsSection } from "@/components/my/tickets-section";
import { MySkeleton } from "@/components/loading/my.loading";
import { PurchasesSection } from "@/components/my/purchases-section";

const MePage = () => {
  const { data, isLoading } = useMyInfo();

  if (isLoading) return <MySkeleton />;

  if (!data)
    return <p className="py-20 text-center">내 정보를 불러오지 못했습니다.</p>;

  return (
    <motion.main>
      <ProfileCard me={data} />

      <Tabs defaultValue="tickets" className="w-full p-4">
        <TabsList className="w-full justify-start overflow-x-auto my-4">
          <TabsTrigger value="tickets">예매 내역</TabsTrigger>
          <TabsTrigger value="purchases">구매 내역</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketsSection />
        </TabsContent>

        <TabsContent value="purchases">
          <PurchasesSection />
        </TabsContent>

        <TabsContent value="settings">
          <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
            🚧 준비 중입니다.
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
            🚧 준비 중입니다.
          </div>
        </TabsContent>
      </Tabs>
    </motion.main>
  );
};

export default MePage;
