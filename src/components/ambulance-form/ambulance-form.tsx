import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { Ambulance, AmbulanceCreate } from '../../utils/ambulance.model';

@Component({
  tag: 'ambulance-form',
  styleUrl: 'ambulance-form.css',
  shadow: true,
})
export class AmbulanceForm {
  @Prop() ambulance?: Ambulance;
  @Event() formSubmit: EventEmitter<AmbulanceCreate>;
  @Event() cancel: EventEmitter<void>;

  @State() formData: AmbulanceCreate = {
    name: '',
    type: 'emergency',
    location: '',
  };

  @State() errors: Partial<Record<keyof AmbulanceCreate, string>> = {};

  componentWillLoad() {
    if (this.ambulance) {
      this.formData = {
        name: this.ambulance.name,
        type: this.ambulance.type,
        location: this.ambulance.location,
      };
    }
  }

  private validateForm(): boolean {
    const newErrors: Partial<Record<keyof AmbulanceCreate, string>> = {};

    if (!this.formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!this.formData.location.trim()) {
      newErrors.location = 'Location is required';
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

  private handleInputChange = (field: keyof AmbulanceCreate) => (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    this.formData = { ...this.formData, [field]: value };
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: undefined };
    }
  };

  render() {
    return (
      <div class="form-container">
        <form onSubmit={this.handleSubmit}>
          <div class="form-header">
            <h2>{this.ambulance ? 'Edit Ambulance' : 'Create New Ambulance'}</h2>
            <button type="button" class="close-button" onClick={() => this.cancel.emit()}>
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <div class="form-group">
            <label htmlFor="name">Name *</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="name"
                value={this.formData.name}
                onInput={this.handleInputChange('name')}
                class={this.errors.name ? 'error' : ''}
                placeholder="Enter ambulance name"
              />
            </div>
            {this.errors.name && <span class="error-message">{this.errors.name}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="type">Type *</label>
            <div class="input-wrapper">
              <select
                id="type"
                onInput={this.handleInputChange('type')}
                class={this.errors.type ? 'error' : ''}
              >
                <option value="emergency" selected={this.formData.type === 'emergency'}>Emergency</option>
                <option value="icu" selected={this.formData.type === 'icu'}>ICU</option>
                <option value="basic" selected={this.formData.type === 'basic'}>Basic</option>
                <option value="transport" selected={this.formData.type === 'transport'}>Transport</option>
              </select>
            </div>
            {this.errors.type && <span class="error-message">{this.errors.type}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="location">Location *</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="location"
                value={this.formData.location}
                onInput={this.handleInputChange('location')}
                class={this.errors.location ? 'error' : ''}
                placeholder="Enter current location"
              />
            </div>
            {this.errors.location && <span class="error-message">{this.errors.location}</span>}
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" onClick={() => this.cancel.emit()}>
              Cancel
            </button>
            <button type="submit" class="submit-button">
              {this.ambulance ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    );
  }
} 