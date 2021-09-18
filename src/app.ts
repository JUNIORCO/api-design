import { validation_rules } from './validator';
import {
  directionToSortOrder,
  extractUniquePostsFromResponses,
  generateGETRequestsFromTags,
  execConcurrentRequests,
  sortArrayBy
} from './helpers';
import { AxiosResponse } from 'axios';
import { PostI, QueryI, ResponsePostI, SortBy } from './schemas';
import { validationResult } from 'express-validator';

const express = require('express');
const app = express();

const cache = require('memory-cache');
const memCache = new cache.Cache();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        memCache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    'success': true
  });
});

app.get('/api/posts', cacheMiddleware(30), validation_rules, async (req, res) => {
  try {
    validationResult(req).throw();
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: e.errors[0].msg
    });
  }

  try {
    // Parse params
    const params: QueryI = req.query;
    const tags: string[] = params.tags.split(',');
    const sortBy: SortBy = params.sortBy;
    const sortOrder: number = directionToSortOrder(params.direction);

    // Generate request promises for concurrency
    const requests: Promise<AxiosResponse<ResponsePostI>>[] = generateGETRequestsFromTags<ResponsePostI>(tags);

    // Resolve promises concurrently
    const responses: AxiosResponse<ResponsePostI>[] = await execConcurrentRequests<ResponsePostI>(requests);

    // Extract the unique posts from all the responses
    const uniquePosts: PostI[] = extractUniquePostsFromResponses(responses, tags);

    // Sort based on query params
    const sortedPosts: PostI[] = sortArrayBy<PostI>(uniquePosts, sortBy, sortOrder);

    // Return to user
    return res.status(200).json({
      posts: sortedPosts
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e
    });
  }
});

export default app;
