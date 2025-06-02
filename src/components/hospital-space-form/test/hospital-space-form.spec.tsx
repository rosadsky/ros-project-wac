import { newSpecPage } from '@stencil/core/testing';
import { HospitalSpaceForm } from '../hospital-space-form';

describe('hospital-space-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HospitalSpaceForm],
      html: `<hospital-space-form></hospital-space-form>`,
    });
    
    expect(page.root).toEqualHtml(`
      <hospital-space-form>
        <mock:shadow-root>
          <div class="form-container">
            <form>
              <div class="form-header">
                <h2>Create New Space</h2>
                <ion-button class="close-button" fill="clear">
                  <ion-icon name="close"></ion-icon>
                </ion-button>
              </div>
              <div class="form-group">
                <ion-label position="stacked">Name *</ion-label>
                <ion-input placeholder="Enter space name" type="text" value=""></ion-input>
              </div>
              <div class="form-group">
                <ion-label position="stacked">Type *</ion-label>
                <ion-select placeholder="Select space type" value="operating_room">
                  <ion-select-option value="operating_room">Operating Room</ion-select-option>
                  <ion-select-option value="emergency_room">Emergency Room</ion-select-option>
                  <ion-select-option value="ward">Ward</ion-select-option>
                  <ion-select-option value="icu">ICU</ion-select-option>
                  <ion-select-option value="consultation_room">Consultation Room</ion-select-option>
                </ion-select>
              </div>
              <div>
                <ion-label position="stacked">Floor *</ion-label>
                <ion-input min="1" type="number" value="1"></ion-input>
              </div>
              <div class="form-group">
                <ion-label position="stacked">Capacity *</ion-label>
                <ion-input min="1" type="number" value="1"></ion-input>
              </div>
              <div class="form-actions">
                <ion-button class="cancel-button" color="medium" fill="outline">
                  Cancel
                </ion-button>
                <ion-button class="submit-button" type="submit">
                  Create
                </ion-button>
              </div>
            </form>
          </div>
        </mock:shadow-root>
      </hospital-space-form>
    `);
  });

  it('displays edit mode when space prop is provided', async () => {
    const page = await newSpecPage({
      components: [HospitalSpaceForm],
      html: `<hospital-space-form></hospital-space-form>`,
    });

    page.rootInstance.space = {
      id: '1',
      space_id: 'space-1',
      name: 'OR-1',
      type: 'operating_room',
      floor: 2,
      capacity: 4,
      status: 'available',
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    await page.waitForChanges();

    const header = page.root?.shadowRoot?.querySelector('h2');
    expect(header?.textContent).toBe('Edit Space');
  });

  it('validates form and shows errors', async () => {
    const page = await newSpecPage({
      components: [HospitalSpaceForm],
      html: `<hospital-space-form></hospital-space-form>`,
    });

    const component = page.rootInstance as HospitalSpaceForm;
    component.formData = { name: '', type: 'operating_room', floor: 1, capacity: 1 };

    const isValid = component['validateForm']();
    expect(isValid).toBe(false);
    expect(component.errors.name).toBe('Name is required');
  });
}); 