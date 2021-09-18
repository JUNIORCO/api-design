export enum SortBy {
  id = 'id',
  reads = 'reads',
  likes = 'likes',
  popularity = 'popularity'
}

export enum Direction {
  asc = 'asc',
  desc = 'desc',
}

export interface QueryI {
  tags: string;
  sortBy: SortBy;
  direction: Direction;
}

export interface PostI {
  author: string;
  authorId: number;
  id: number;
  likes: number;
  popularity: number;
  reads: number;
  tags: string[];
}

export interface ResponsePostI {
  posts: PostI[]
}
