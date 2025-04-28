import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const HeroSection = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 dark:from-primary/30 dark:via-accent/10 dark:to-secondary/10"
      />
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6"
        >
          원하는 티켓, <span className="text-primary">지금</span> 바로
          예매하세요
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="text-lg text-muted-foreground mb-10"
        >
          공연 · 전시 · 스포츠까지! 빠르고 안전한 실시간 티켓팅 플랫폼
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="mx-auto flex max-w-xl items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            window.location.href = `/events?search=${encodeURIComponent(
              query.trim()
            )}`;
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="어떤 행사를 찾으시나요?"
            className="flex-1 h-12"
          />
          <Button type="submit" className="h-12 px-6">
            검색
          </Button>
        </motion.form>
      </div>
    </section>
  );
};
