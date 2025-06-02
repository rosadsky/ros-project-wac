import { newE2EPage } from '@stencil/core/testing';

describe('hospital-space-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<hospital-space-form></hospital-space-form>');

    const element = await page.find('hospital-space-form');
    expect(element).toHaveClass('hydrated');
  });

  it('displays form elements', async () => {
    const page = await newE2EPage();
    await page.setContent('<hospital-space-form></hospital-space-form>');

    const header = await page.find('hospital-space-form >>> h2');
    expect(header.textContent).toBe('Create New Space');

    const nameInput = await page.find('hospital-space-form >>> ion-input[type="text"]');
    expect(nameInput).toBeTruthy();

    const submitButton = await page.find('hospital-space-form >>> .submit-button');
    expect(submitButton.textContent.trim()).toBe('Create');
  });
}); 