import { newE2EPage } from '@stencil/core/testing';

describe('r-button e2e', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<r-button></r-button>');

    const element = await page.find('r-button');
    expect(element).toHaveClass('hydrated');
  });
});

