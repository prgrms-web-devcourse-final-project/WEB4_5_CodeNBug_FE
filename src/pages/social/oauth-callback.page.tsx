import { LoaderFunction, redirect, useLoaderData } from "react-router";
import { motion } from "motion/react";
import { SocialForm } from "@/components/auth/social";
import { fetchSession } from "@/services/fetch-session";
import { getOAuthInfo } from "@/services/auth.service";
import { toast } from "sonner";

// 🎯 Loader에서 넘겨줄 데이터를 포함한 타입 정의
interface LoaderData {
  code: string;
  provider: "google" | "kakao";
  oauthData: {
    name: string;
    provider: string;
    socialId: string;
  };
}

export const OAuthCallbackPage = () => {
  const { code, provider, oauthData } = useLoaderData() as LoaderData;

  return (
    <motion.section
      className="flex h-full items-center justify-center bg-muted/40 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 👉 loader로부터 받은 사용자 정보 전달 */}
      <SocialForm code={code} provider={provider} oauthData={oauthData} />
    </motion.section>
  );
};

export const oauthCallbackLoader: LoaderFunction = async ({
  params,
  request,
}) => {
  const provider = params.provider as "google" | "kakao";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code || !provider) throw redirect("/auth");

  const oauthResponse = await getOAuthInfo(provider, code).catch(() => {
    toast.error("로그인 중 에러가 발생하였습니다.");
    throw redirect("/");
  });

  const me = await fetchSession();
  if (me?.data?.age) throw redirect("/");

  return {
    code,
    provider,
    oauthData: oauthResponse.data.data, // ✅ 여기서 사용자 정보 추가
  };
};
