import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { HospitalSpace, HospitalSpaceCreate } from '../../utils/hospital-space.model';

@Component({
  tag: 'hospital-space-form',
  styleUrl: 'hospital-space-form.css',
  shadow: true,
})
export class HospitalSpaceForm {
  @Prop() space?: HospitalSpace;
  @Event() formSubmit: EventEmitter<HospitalSpaceCreate>;
  @Event() cancel: EventEmitter<void>;

  @State() formData: HospitalSpaceCreate = {
    name: '',
    floor: 1,
    type: 'operating_room',
    capacity: 1,
  };

  @State() errors: Partial<Record<keyof HospitalSpaceCreate, string>> = {};

  componentWillLoad() {
    if (this.space) {
      this.formData = {
        name: this.space.name,
        floor: this.space.floor,
        type: this.space.type,
        capacity: this.space.capacity,
      };
    }
  }

  private validateForm(): boolean {
    const newErrors: Partial<Record<keyof HospitalSpaceCreate, string>> = {};

    if (!this.formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (this.formData.floor < 1) {
      newErrors.floor = 'Floor must be at least 1';
    }

    if (this.formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.formSubmit.emit(this.formData);
    }
  };

  private handleInputChange = (field: keyof HospitalSpaceCreate) => (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.type === 'number' ? Number(target.value) : target.value;
    this.formData = { ...this.formData, [field]: value };
    // Clear error when user starts typing
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: undefined };
    }
  };

  render() {
    return (
      <div class="form-container">
        <form onSubmit={this.handleSubmit}>
          <div class="form-header">
            <h2>{this.space ? 'Edit Space' : 'Create New Space'}</h2>
            <ion-button 
              fill="clear" 
              class="close-button" 
              onClick={() => this.cancel.emit()}
            >
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </div>
          
          <div class="form-group">
            <ion-label position="stacked">Name *</ion-label>
            <ion-input
              type="text"
              value={this.formData.name}
              onIonInput={this.handleInputChange('name')}
              class={this.errors.name ? 'error' : ''}
              placeholder="Enter space name"
            ></ion-input>
            {this.errors.name && <span class="error-message">{this.errors.name}</span>}
          </div>

          <div class="form-group">
            <ion-label position="stacked">Type *</ion-label>
            <ion-select
              value={this.formData.type}
              onIonChange={this.handleInputChange('type')}
              class={this.errors.type ? 'error' : ''}
              placeholder="Select space type"
            >
              <ion-select-option value="operating_room">Operating Room</ion-select-option>
              <ion-select-option value="emergency_room">Emergency Room</ion-select-option>
              <ion-select-option value="ward">Ward</ion-select-option>
              <ion-select-option value="icu">ICU</ion-select-option>
              <ion-select-option value="consultation_room">Consultation Room</ion-select-option>
            </ion-select>
            {this.errors.type && <span class="error-message">{this.errors.type}</span>}
          </div>

          <div>
            <ion-label position="stacked">Floor *</ion-label>
            <ion-input
              type="number"
              value={this.formData.floor}
              onIonInput={this.handleInputChange('floor')}
              min="1"
            ></ion-input>
            {this.errors.floor && <span class="error-message">{this.errors.floor}</span>}
          </div>

          <div class="form-group">
            <ion-label position="stacked">Capacity *</ion-label>
            <ion-input
              type="number"
              value={this.formData.capacity}
              onIonInput={this.handleInputChange('capacity')}
              min="1"
            ></ion-input>
            {this.errors.capacity && <span class="error-message">{this.errors.capacity}</span>}
          </div>

          <div class="form-actions">
            <ion-button 
              fill="outline" 
              color="medium" 
              class="cancel-button" 
              onClick={() => this.cancel.emit()}
            >
              Cancel
            </ion-button>
            <ion-button 
              type="submit" 
              class="submit-button"
            >
              {this.space ? 'Update' : 'Create'}
            </ion-button>
          </div>
        </form>
      </div>
    );
  }
} 