import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import axios from "axios";

interface OAuthButtonProps {
  provider: "kakao" | "google";
  disabled: boolean;
}

const providerStyle: Record<OAuthButtonProps["provider"], string> = {
  kakao:
    "bg-[#FEE500] dark:bg-[#FEE500] text-white text-[#181600] hover:bg-[#f9e000] dark:hover:text-black dark:hover:bg-[#f9e000]",
  google:
    "bg-white text-gray-700 border hover:bg-gray-50 dark:hover:bg-gray-50 dark:bg-gray-200 dark:text-gray-800",
};

const providerLabel: Record<OAuthButtonProps["provider"], string> = {
  kakao: "카카오로 계속하기",
  google: "Google로 계속하기",
};

export const OAuthButton = ({ provider, disabled }: OAuthButtonProps) => {
  const oauthLoginHandler = async () => {
    const { data } = await axios.get(
      `${
        import.meta.env.MODE === "development"
          ? "/auth-api"
          : import.meta.env.VITE_SERVER_URL
      }/auth/${provider}`,
      {
        withCredentials: true,
        params: {
          redirectUrl: `${
            import.meta.env.VITE_CLIENT_URL
          }/auth/${provider}/callback`,
        },
      }
    );

    if (data) {
      window.location.href = data;
    }
  };

  return (
    <Button
      asChild
      disabled={disabled}
      variant="outline"
      className={cn(
        "w-full",
        providerStyle[provider],
        disabled && "opacity-50 pointer-events-none"
      )}
      onClick={oauthLoginHandler}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <span className={`i-simple-icons-${provider} text-xl`} />
        {providerLabel[provider]}
      </span>
    </Button>
  );
};
