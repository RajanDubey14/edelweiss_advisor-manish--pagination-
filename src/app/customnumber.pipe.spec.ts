import { CustomnumberPipe } from './customnumber.pipe';

describe('CustomnumberPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomnumberPipe();
    expect(pipe).toBeTruthy();
  });
});
