import { motion } from "motion/react";
import { useMyInfo } from "@/services/query/user.query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/my/profile-card";
import { TicketsSection } from "@/components/my/tickets-section";
import { MySkeleton } from "@/components/loading/my.loading";

const MePage = () => {
  const { data, isLoading } = useMyInfo();

  if (isLoading) return <MySkeleton />;

  if (!data)
    return <p className="py-20 text-center">내 정보를 불러오지 못했습니다.</p>;

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 space-y-10"
    >
      <ProfileCard me={data} />
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="tickets">예매 내역</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <TicketsSection />
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
