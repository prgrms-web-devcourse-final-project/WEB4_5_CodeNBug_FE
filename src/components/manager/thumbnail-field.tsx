import { useState, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "motion/react";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import type { CreateEventPayload } from "@/schemas/manager.schema";
import { getImageUrl } from "@/services/manager.service";

const stripExtension = (name: string) => name.replace(/\.[^/.]+$/, "");

const uploadFile = async (url: string, file: File) => {
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
};

const getObjectUrl = (presignedUrl: string) => presignedUrl.split("?")[0];

export const ThumbnailField = () => {
  const { control, setValue } = useFormContext<CreateEventPayload>();
  const [loading, setLoading] = useState(false);
  const [isDragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const plainName = stripExtension(file.name);
        const res = await getImageUrl([plainName]);

        const presignedUrl = res.data.data.find(
          (d) => d.fileName === plainName
        )?.url;

        if (!presignedUrl) throw new Error("URL not found");

        await uploadFile(presignedUrl, file);

        setValue("thumbnailUrl", getObjectUrl(presignedUrl), {
          shouldDirty: true,
          shouldValidate: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [setValue]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="thumbnailUpload">썸네일 *</Label>

      <Controller
        name="thumbnailUrl"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <motion.div
              className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center"
              initial={false}
              animate={isDragOver ? "drag" : "rest"}
              variants={{
                rest: { borderColor: "hsl(var(--muted-foreground))" },
                drag: { borderColor: "hsl(var(--primary))", scale: 1.02 },
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <input
                id="thumbnailUpload"
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />

              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  업로드 중...
                </motion.div>
              ) : (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  클릭 또는 드래그하여 이미지를 선택하세요
                </motion.p>
              )}
            </motion.div>

            {field.value && !loading && (
              <motion.div
                key={field.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 break-all text-xs bg-muted/50 py-2 px-3 rounded"
              >
                {field.value}
              </motion.div>
            )}

            <input type="hidden" {...field} />

            {fieldState.error && (
              <p className="text-xs text-destructive" role="alert">
                {fieldState.error.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
