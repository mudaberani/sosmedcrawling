export interface Storage {
  save(hashtag: string, data: Set<string>): void;
}
