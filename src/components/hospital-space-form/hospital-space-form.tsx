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
    roomNumber: '',
    type: 'AMBULANCE',
    capacity: 1,
    description: ''
  };

  @State() errors: Partial<Record<keyof HospitalSpaceCreate, string>> = {};

  componentWillLoad() {
    if (this.space) {
      this.formData = {
        name: this.space.name,
        floor: this.space.floor,
        roomNumber: this.space.roomNumber,
        type: this.space.type,
        capacity: this.space.capacity,
        description: this.space.description
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

    if (!this.formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
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
    const target = e.target as HTMLInputElement;
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
            <button type="button" class="close-button" onClick={() => this.cancel.emit()}>
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <div class="form-group">
            <label htmlFor="name">Name</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="name"
                value={this.formData.name}
                onInput={this.handleInputChange('name')}
                class={this.errors.name ? 'error' : ''}
                placeholder="Enter space name"
              />
            </div>
            {this.errors.name && <span class="error-message">{this.errors.name}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="floor">Floor</label>
            <div class="input-wrapper">
              <input
                type="number"
                id="floor"
                value={this.formData.floor}
                onInput={this.handleInputChange('floor')}
                min="1"
                class={this.errors.floor ? 'error' : ''}
              />
            </div>
            {this.errors.floor && <span class="error-message">{this.errors.floor}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="roomNumber">Room Number</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="roomNumber"
                value={this.formData.roomNumber}
                onInput={this.handleInputChange('roomNumber')}
                class={this.errors.roomNumber ? 'error' : ''}
                placeholder="Enter room number"
              />
            </div>
            {this.errors.roomNumber && <span class="error-message">{this.errors.roomNumber}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="type">Type</label>
            <div class="input-wrapper">
              <select
                id="type"
                onInput={this.handleInputChange('type')}
                class={this.errors.type ? 'error' : ''}
              >
                <option value="AMBULANCE" selected={this.formData.type === 'AMBULANCE'}>Ambulance</option>
                <option value="DEPARTMENT" selected={this.formData.type === 'DEPARTMENT'}>Department</option>
              </select>
            </div>
            {this.errors.type && <span class="error-message">{this.errors.type}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="capacity">Capacity</label>
            <div class="input-wrapper">
              <input
                type="number"
                id="capacity"
                value={this.formData.capacity}
                onInput={this.handleInputChange('capacity')}
                min="1"
                class={this.errors.capacity ? 'error' : ''}
              />
            </div>
            {this.errors.capacity && <span class="error-message">{this.errors.capacity}</span>}
          </div>

          <div class="form-group">
            <label htmlFor="description">Description</label>
            <div class="input-wrapper">
              <textarea
                id="description"
                value={this.formData.description}
                onInput={this.handleInputChange('description')}
                placeholder="Enter space description (optional)"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" onClick={() => this.cancel.emit()}>
              Cancel
            </button>
            <button type="submit" class="submit-button">
              {this.space ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    );
  }
} 