import { Repository } from 'typeorm';
import { MockType } from './mock.type';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const repositoryMock: () => MockType<Repository<any>> = jest.fn(() => ({
  createQueryBuilder: jest.fn(),
  hasId: jest.fn(),
  getId: jest.fn(),
  create: jest.fn(),
  merge: jest.fn(),
  preload: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  recover: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  count: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  findByIds: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  query: jest.fn(),
  clear: jest.fn(),
  increment: jest.fn(),
  decrement: jest.fn(),
}));
