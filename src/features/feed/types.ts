export const scenarios = [
  "normal",
  "loading",
  "empty",
  "error",
  "pagination-error",
  "long-text",
] as const;
export type FeedScenario = (typeof scenarios)[number];
export type Story = {
  id: string;
  title: string;
  body: string;
  metadata?: string;
  background: "window" | "cafe";
};
export type FeedPage = { items: Story[]; next: number | null };
