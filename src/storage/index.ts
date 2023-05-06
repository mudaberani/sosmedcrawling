export interface Storage {
  save(platform: string, category: string, name: string, data: Set<string>): string;
}
