import { SocialForm } from "@/components/auth/social";
import { useSearchParams } from "react-router";

const GooglePage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="flex items-center justify-center">
      <SocialForm code={code} />
    </div>
  );
};

export default GooglePage;
