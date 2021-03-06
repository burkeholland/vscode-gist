// tslint:disable:no-any no-magic-numbers no-unsafe-any
import { commands, window } from 'vscode';

import { open } from '../open';

jest.mock('fs');
jest.mock('path');

const getGistsMock = jest.fn(() => [
  {
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-one.md': { content: 'test' } },
    id: '123',
    name: 'gist one',
    public: true,
    updatedAt: new Date()
  },
  {
    createdAt: new Date(),
    description: 'some markdown file',
    fileCount: 1,
    files: { 'file-two.md': { content: 'test' } },
    id: '123',
    name: 'gist two',
    public: true,
    updatedAt: new Date()
  }
]);
const getGistMock = jest.fn((id: string) => ({
  createdAt: new Date(),
  description: 'some markdown file',
  fileCount: 1,
  files: { 'file-one.md': { content: 'test' } },
  id,
  name: 'test',
  public: true,
  updatedAt: new Date()
}));
const utilsMock = jest.genMockFromModule<Utils>('../../../utils');
const errorMock = jest.fn();

const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

describe('open gist', () => {
  let openFn: CommandFn;
  beforeEach(() => {
    const gists = { getGists: getGistsMock, getGist: getGistMock };
    const insights = { exception: jest.fn() };
    const logger = { error: errorMock, info: jest.fn() };
    openFn = open(
      { get: jest.fn() },
      { gists, insights, logger } as any,
      utilsMock as any
    )[1];
    (<any>window).activeTextEditor = undefined;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('what happens when errors occur', async () => {
    expect.assertions(1);

    (<any>utilsMock.input.quickPick).mockRejectedValueOnce(false);

    await openFn();
    expect(errorMock.mock.calls.length).toBe(1);
  });
  test('it opens the quickpick pane', async () => {
    expect.assertions(3);

    await openFn();

    expect((<any>utilsMock.input.quickPick).mock.calls.length).toBe(1);

    const firstGist = (<any>utilsMock.input.quickPick).mock.calls[0][0][0];
    const secondGist = (<any>utilsMock.input.quickPick).mock.calls[0][0][1];

    expect(firstGist.name).toBe('gist one');
    expect(secondGist.name).toBe('gist two');
  });
  test('it opens a document', async () => {
    expect.assertions(1);

    (<any>utilsMock.input.quickPick).mockResolvedValue({
      block: {
        id: '123'
      },
      label: 'foo'
    });

    await openFn();

    expect(executeCommandSpy).toHaveBeenCalledWith(
      'workbench.action.keepEditor'
    );
  });
});
