"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { toast } from "sonner";
import { MyInfoType } from "@/schemas/user.schema";
import { formatPhone } from "@/lib/utils";
import * as z from "zod";
import { useUpdateMyInfo } from "@/services/query/user.query";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const editSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일은 필수 입력 항목입니다." })
    .email({ message: "유효한 이메일 형식이 아닙니다." }),
  name: z.string().nonempty({ message: "이름은 필수 입력 항목입니다." }),
  age: z.string().regex(/^\d+$/, { message: "나이는 숫자만 입력해주세요." }),
  sex: z.string().nonempty({ message: "성별은 필수 입력 항목입니다." }),
  phoneNum: z
    .string()
    .nonempty({ message: "전화번호는 필수 입력 항목입니다." })
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, {
      message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
    }),
  location: z.string().nonempty({ message: "주소는 필수 입력 항목입니다." }),
});
type EditPayload = z.infer<typeof editSchema>;

interface Props {
  me: MyInfoType;
}

export const EditProfileDrawer = ({ me }: Props) => {
  const form = useForm<EditPayload>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      ...me,
      age: me.age.toString(),
    },
  });

  const { mutate, isPending } = useUpdateMyInfo();

  const onSubmit = (data: EditPayload) =>
    mutate(
      { ...data, age: +data.age },
      {
        onSuccess: () => toast.success("프로필이 업데이트되었습니다."),
        onError: () => toast.error("수정 실패"),
      }
    );

  const handleNumericChange = useCallback(
    (onChange: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value.replace(/\D/g, ""));
      },
    []
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="secondary">
          정보 수정
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 p-4"
          >
            <DrawerHeader className="p-0">
              <DrawerTitle>프로필 수정</DrawerTitle>
            </DrawerHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>나이</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      placeholder="25"
                      {...field}
                      onChange={handleNumericChange(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성별</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="남">
                        남
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="여">
                        여
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="기타">
                        기타
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>휴대폰</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>지역</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="p-0 pt-2">
              <Button type="submit" className="w-full">
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "저장"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  취소
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </motion.form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
