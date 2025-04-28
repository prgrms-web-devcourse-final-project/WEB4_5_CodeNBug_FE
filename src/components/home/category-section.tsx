import { categories } from "@/constants/category";
import { Link } from "react-router";

export const CategorySection = () => (
  <section className="container mx-auto space-y-6 px-4">
    <h2 className="text-2xl font-semibold">카테고리로 찾기</h2>
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
      {categories.map((c) => (
        <Link
          key={c.name}
          to={`/events?category=${c.name}`}
          className="group relative block aspect-square overflow-hidden rounded-lg"
        >
          {c.img ? (
            <img
              src={c.img}
              alt={c.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary to-secondary blur-sm" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
            <span className="text-sm font-medium text-white drop-shadow-lg">
              {c.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);
