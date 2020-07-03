import { suggest, words } from './api';
import { makeRequest } from './make_request';

jest.mock('./make_request');

test('suggestions api', () => {
  suggest('boo');
  expect((makeRequest as any).mock.calls[0][0]).toBe('/sug?s=boo');
});

describe('words api', () => {
  describe('startsWith, endsWith, and wildCount', () => {
    test('startsWith', () => {
      words({
        startsWith: 'j',
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=j*');
    });
    test('endsWith', () => {
      words({
        endsWith: 'k',
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=*k');
    });
    test('starts and ends with', () => {
      words({
        startsWith: 'j',
        endsWith: 'k',
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=j*k');
    });
    test('startsWith and fixed characters', () => {
      words({
        startsWith: 'j',
        wildCount: 5,
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=j?????');
    });
    test('endsWith and fixed characters', () => {
      words({
        endsWith: 'k',
        wildCount: 3,
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=???k');
    });
    test('starts and ends with and fixed characters', () => {
      words({
        startsWith: 'j',
        endsWith: 'k',
        wildCount: 2,
      });
      expect((makeRequest as any).mock.calls[0][0]).toBe('/words?sp=j??k');
    });
  });
});
