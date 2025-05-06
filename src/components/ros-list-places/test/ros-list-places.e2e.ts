import { newE2EPage } from '@stencil/core/testing';

describe('ros-list-places', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ros-list-places></ros-list-places>');

    const element = await page.find('ros-list-places');
    expect(element).toHaveClass('hydrated');
  });
});
