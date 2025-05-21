const DOMAIN = {
  USER: "user",
  MY: "my",
  EVENT: "event",
  CATEGORY: "category",
  MANAGER: "manager",
  AVAILABLE: "available",
  SEAT: "seat",
};

export const QUERY_KEY = {
  USER: {
    MY: [DOMAIN.USER, DOMAIN.MY],
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
  },
  NOTIFICATION: {
    DEFAULT: ["notification"] as const,
    ALL: (userId: number) => ["notification", "all", userId] as const,
    UNREAD: (userId: number) => ["notification", "unread", userId] as const,
    DETAIL: (userId: number, notiId: number) =>
      ["notification", userId, notiId] as const,
  },
};
