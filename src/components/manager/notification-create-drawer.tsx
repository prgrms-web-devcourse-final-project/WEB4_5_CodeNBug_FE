import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateNotificationPayload,
  CreateNotificationPayloadSchema,
  NotificationTypeEnum,
} from "@/schemas/notification.schema";
import { z } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (p: CreateNotificationPayload) => void;
}

export const NotificationCreateDrawer = ({
  open,
  onOpenChange,
  onSubmit,
}: Props) => {
  const form = useForm<z.infer<typeof CreateNotificationPayloadSchema>>({
    resolver: zodResolver(CreateNotificationPayloadSchema),
    defaultValues: {
      userId: "",
      type: "PAYMENT",
      title: "",
      content: "",
    },
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild />
      <DrawerContent className="max-h-[90vh] p-6">
        <h2 className="mb-4 text-lg font-semibold">공지 작성</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수신자&nbsp;ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>알림&nbsp;타입</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NotificationTypeEnum.options.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="공지 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="공지 내용을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="mt-6">
              <Button type="submit" className="w-full">
                발송
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary" className="w-full">
                  취소
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
