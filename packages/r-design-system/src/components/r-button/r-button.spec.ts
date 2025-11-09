import { newSpecPage } from '@stencil/core/testing';
import { RButton } from './r-button';

describe('r-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RButton],
      html: `<r-button></r-button>`,
    });
    expect(page.root).toEqualHtml(`
      <r-button>
        <mock:shadow-root>
          <button class="r-button r-button--primary r-button--md" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </r-button>
    `);
  });
});

