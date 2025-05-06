import { newSpecPage } from '@stencil/core/testing';
import { RosListPlaces } from '../ros-list-places';

describe('ros-list-places', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RosListPlaces],
      html: `<ros-list-places></ros-list-places>`,
    });
    expect(page.root).toEqualHtml(`
      <ros-list-places>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ros-list-places>
    `);
  });
});
