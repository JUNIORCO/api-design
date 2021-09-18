import { DEFAULT_DIRECTION, DEFAULT_SORTBY } from './constants';
import { INVALID_DIRECTION, INVALID_SORTBY, INVALID_TAGS } from './errors';
import { isInEnum } from './helpers';
import { Direction, SortBy } from './schemas';

const { checkSchema } = require('express-validator');

export const validation_rules = checkSchema({
  tags: {
    in: 'query',
    exists: true,
    errorMessage: INVALID_TAGS,
  },
  sortBy: {
    in: 'query',
    customSanitizer: {
      options: (value) => !value ? DEFAULT_SORTBY : value
    },
    custom: {
      options: (value) => isInEnum(SortBy, value)
    },
    errorMessage: INVALID_SORTBY
  },
  direction: {
    in: 'query',
    customSanitizer: {
      options: (value) => !value ? DEFAULT_DIRECTION : value
    },
    custom: {
      options: (value) => isInEnum(Direction, value)
    },
    errorMessage: INVALID_DIRECTION
  }
});
