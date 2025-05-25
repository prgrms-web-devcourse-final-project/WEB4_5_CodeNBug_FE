const DOMAIN = {
  USER: "user",
  MY: "my",
  EVENT: "event",
  CATEGORY: "category",
  MANAGER: "manager",
  AVAILABLE: "available",
  SEAT: "seat",
  PURCHASE: "purchase",
  OAUTH: "oauth",
};

export const QUERY_KEY = {
  USER: {
    OAUTH: [DOMAIN.OAUTH],
    MY: [DOMAIN.USER, DOMAIN.MY],
    PURCHASE: {
      MY_LIST: (page: number) => [DOMAIN.USER, DOMAIN.PURCHASE, "list", page],
      DETAIL: (purchasesId: number | null) => [
        DOMAIN.USER,
        DOMAIN.PURCHASE,
        purchasesId,
      ],
    },
  },
  EVENT: {
    LIST: [DOMAIN.EVENT],
    DETAIL: (eventId: string) => [DOMAIN.EVENT, eventId],
    CATEGORY: [DOMAIN.EVENT, DOMAIN.CATEGORY],
    AVAILABLE: (eventId: string) => [DOMAIN.EVENT, DOMAIN.AVAILABLE, eventId],
    SEAT: (eventId: string) => [DOMAIN.SEAT, eventId],
  },
  MANAGER: {
    DEFAULT: [DOMAIN.MANAGER],
    PURCHASE_LIST: (id: number | null) => [DOMAIN.MANAGER, "purchase-list", id],
  },
  NOTIFICATION: {
    DEFAULT: ["notification"] as const,
    ALL: (userId: number) => ["notification", "all", userId] as const,
    UNREAD: (userId: number) => ["notification", "unread", userId] as const,
    DETAIL: (userId: number, notiId: number) =>
      ["notification", userId, notiId] as const,
  },
};
