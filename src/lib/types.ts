export type Language = "en" | "de";

export interface Link {
  title: string;
  url: string;
  username?: string;
  inactive?: boolean;
  language: Language;
}
