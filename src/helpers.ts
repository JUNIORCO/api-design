import { axiosInstance as axios } from './config';
import { postsURL } from './constants';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Direction, PostI, ResponsePostI, SortBy } from './schemas';

const _ = require('lodash');

export const execConcurrentRequests = async <T>(requests: Promise<AxiosResponse<T>>[]): Promise<AxiosResponse<T>[]> => {
  return Promise.all(requests);
}

const generateGETRequest = <T>(url: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return axios.get(url, config);
};

export const generateGETRequestsFromTags = <T>(tags: string[]): Promise<AxiosResponse<T>>[] => {
  return tags.map((tag: string) => {
    const config: AxiosRequestConfig = { params: { tag } };
    return generateGETRequest<T>(postsURL, config)
  });
};

export const extractUniquePostsFromResponses = (responses: AxiosResponse<ResponsePostI>[], queryTags: string[]): PostI[] => {
  const uniquePostsMap = new Map<number, PostI>();

  responses.forEach((response: AxiosResponse<ResponsePostI>) => {
    response.data.posts.forEach((post: PostI) => {
      if (!uniquePostsMap.has(post.id)) {
        uniquePostsMap.set(post.id, post);
      }
    });
  })

  return mapValuesToArray<number, PostI>(uniquePostsMap);
};

export const sortArrayBy = <T>(arr: T[], sortBy: SortBy, sortOrder: number): T[] =>
  (_.sortBy(arr, (el: T) => el[sortBy] * sortOrder));

export const mapValuesToArray = <K, V>(map: Map<K, V>): V[] => (Array.from(map, ([, value]) => (value)));

export const directionToSortOrder = (direction: Direction): number => ((direction === Direction.asc) ? 1 : -1);

export const isInEnum = (enumeration, val): boolean => (Object.values(enumeration).includes(val));
