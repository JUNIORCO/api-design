import {
  directionToSortOrder,
  extractUniquePostsFromResponses,
  isInEnum,
  mapValuesToArray,
  sortArrayBy
} from "../src/helpers";
import { Direction, PostI, ResponsePostI, SortBy } from "../src/schemas";
import { AxiosResponse } from "axios";
import { mockTechPostsBody, mockTechPostsSortedByLikesDesc } from "./mocks/TechPosts.mock";
import { mockHealthPostsBody } from "./mocks/HealthPosts.mock";
import { mockUniqueTechAndHealthPostsBody } from "./mocks/UniqueTechAndHealthPosts.mock";

describe('Unit tests', () => {
  describe('directionToSortOrder', () => {
    it('should return 1 when asc', () => {
      const expected = 1;
      const res = directionToSortOrder(Direction.asc);
      expect(res).toEqual(expected);
    });

    it('should return -1 when desc', () => {
      const expected = -1;
      const res = directionToSortOrder(Direction.desc);
      expect(res).toEqual(expected);
    });
  });

  describe('isInEnum', () => {
    it('should return true if value is in enum', () => {
      const expected = true;
      const res = isInEnum(Direction, 'asc');
      expect(res).toEqual(expected);
    });

    it('should return false if value is not in enum', () => {
      const expected = false;
      const res = isInEnum(Direction, 'abc');
      expect(res).toEqual(expected);
    });
  });

  describe('mapToArray', () => {
    it('should convert the map values to an array', () => {
      const map = new Map<number, string>();
      map.set(1, 'a');
      map.set(2, 'b');
      map.set(3, 'c');
      const expected = ['a', 'b', 'c'];
      const res = mapValuesToArray<number, string>(map);
      expect(res).toEqual(expected);
    });
  });

  describe('extractUniquePostsFromResponses', () => {
    it('should extract the unique posts from an array of responses', () => {
      const tags = ['tech', 'health'];
      const responses: AxiosResponse<ResponsePostI>[] = [
        { data: mockTechPostsBody } as AxiosResponse,
        { data: mockHealthPostsBody } as AxiosResponse
      ];
      const expected = mockUniqueTechAndHealthPostsBody.posts;
      const res = extractUniquePostsFromResponses(responses, tags);
      expect(res).toEqual(expected);
    });
  });

  describe('sortBy', () => {
    it('should sort an array of posts by likes in desc order', () => {
      const posts: PostI[] = mockTechPostsBody.posts;
      const sortBy: SortBy = SortBy.likes;
      const sortOrder: number = directionToSortOrder(Direction.desc);
      const expected = mockTechPostsSortedByLikesDesc.posts;
      const res = sortArrayBy<PostI>(posts, sortBy, sortOrder);
      expect(res).toEqual(expected);
    });
  });

});
