import { categories } from "@/constants/category";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router";

type ImgKey = "etc" | "exhibition" | "fanMeeting" | "musical" | "sports";
const images: ImgKey[] = [
  "etc",
  "exhibition",
  "fanMeeting",
  "musical",
  "sports",
];
const getImage = async (image: ImgKey) => {
  const { data } = await axios.get(
    `${
      import.meta.env.MODE === "development"
        ? "/auth-api"
        : import.meta.env.VITE_SERVER_URL
    }/imgs/${image}.png`,
    { responseType: "blob" }
  );

  return URL.createObjectURL(data as Blob);
};

export const CategorySection = () => {
  const results = useQueries({
    queries: images.map((c) => ({
      queryKey: ["categoryImg", c],
      queryFn: () => getImage(c as ImgKey),
      staleTime: Infinity,
    })),
  });

  useEffect(() => {
    results.forEach((r) => {
      if (r.data) return () => URL.revokeObjectURL(r.data);
    });
  }, [results]);

  return (
    <section className="container mx-auto space-y-6 px-4">
      <h2 className="text-2xl font-semibold">카테고리로 찾기</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {categories.map((c, i) => {
          const { isLoading, isError, data } = results[i] ?? {};
          const imgSrc = data ?? c.img;

          return (
            <Link
              key={c.name}
              to={`/events?category=${c.name}`}
              className="group relative block aspect-square overflow-hidden rounded-lg"
            >
              {isLoading && (
                <div className="h-full w-full animate-pulse bg-muted/40" />
              )}

              {!isLoading && !isError && imgSrc && (
                <img
                  src={imgSrc}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
                />
              )}

              {(!imgSrc || isError) && !isLoading && (
                <div className="h-full w-full bg-gradient-to-br from-primary to-secondary blur-sm" />
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                <span className="text-sm font-medium text-white drop-shadow-lg">
                  {c.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
