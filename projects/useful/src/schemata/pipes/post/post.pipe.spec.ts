import { PostPipe } from './post.pipe';

describe('PostPipe', () => {
  it('create an instance', () => {
    const pipe = new PostPipe();
    expect(pipe).toBeTruthy();
  });
});
