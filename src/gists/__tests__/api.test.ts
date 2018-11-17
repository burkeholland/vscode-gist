// tslint:disable:no-any no-magic-numbers
import { getGists } from '../api';

describe('Gists API Tests', () => {
  describe('#list', () => {
    test('list without params should return one block', async () => {
      expect.assertions(2);

      const storageBlocks = await getGists();

      expect(storageBlocks.length).toBe(2);

      expect(storageBlocks[0].description).toBe('gist one');
    });
    test('list with starred params should return one block', async () => {
      expect.assertions(2);

      const storageBlocks = await getGists(true);

      expect(storageBlocks.length).toBe(2);

      expect(storageBlocks[0].description).toBe('gist one');
    });
  });
});
