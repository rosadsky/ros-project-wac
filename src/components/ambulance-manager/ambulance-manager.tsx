import { Component, h, State, Prop } from '@stencil/core';
import { Ambulance, AmbulanceCreate, AmbulanceUpdate } from '../../utils/ambulance.model';
import { AmbulanceService } from '../../utils/ambulance.service';

@Component({
  tag: 'ambulance-manager',
  styleUrl: 'ambulance-manager.css',
  shadow: true,
})
export class AmbulanceManager {
  @Prop() apiBase: string = 'http://localhost:8080/api';
  
  @State() ambulances: Ambulance[] = [];
  @State() showCreateForm = false;
  @State() editingAmbulance: Ambulance | null = null;
  @State() loading = false;
  @State() error: string | null = null;
  @State() successMessage: string | null = null;
  
  private ambulanceService: AmbulanceService;

  constructor() {
    this.ambulanceService = new AmbulanceService(this.apiBase);
  }

  async componentWillLoad() {
    await this.loadAmbulances();
  }

  private async loadAmbulances() {
    try {
      this.loading = true;
      this.error = null;
      this.ambulances = await this.ambulanceService.getAllAmbulances();
    } catch (err) {
      this.error = 'Failed to load ambulances. Please try again later.';
      console.error('Error loading ambulances:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleCreate(ambulance: AmbulanceCreate) {
    try {
      this.loading = true;
      this.error = null;
      await this.ambulanceService.createAmbulance(ambulance);
      await this.loadAmbulances();
      this.showCreateForm = false;
      this.successMessage = 'Ambulance created successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (err) {
      this.error = 'Failed to create ambulance. Please try again.';
      console.error('Error creating ambulance:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleUpdate(ambulanceId: string, update: AmbulanceUpdate) {
    try {
      this.loading = true;
      this.error = null;
      await this.ambulanceService.updateAmbulance(ambulanceId, update);
      await this.loadAmbulances();
      this.editingAmbulance = null;
      this.successMessage = 'Ambulance updated successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (err) {
      this.error = 'Failed to update ambulance. Please try again.';
      console.error('Error updating ambulance:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleDelete(ambulanceId: string) {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      try {
        this.loading = true;
        this.error = null;
        await this.ambulanceService.deleteAmbulance(ambulanceId);
        await this.loadAmbulances();
        this.successMessage = 'Ambulance deleted successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      } catch (err) {
        this.error = 'Failed to delete ambulance. Please try again.';
        console.error('Error deleting ambulance:', err);
      } finally {
        this.loading = false;
      }
    }
  }

  private getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available': return 'status-available';
      case 'on_duty': return 'status-on-duty';
      case 'maintenance': return 'status-maintenance';
      case 'out_of_service': return 'status-out-of-service';
      default: return 'status-unknown';
    }
  }

  private getTypeDisplayName(type: string): string {
    switch (type) {
      case 'emergency': return 'Emergency';
      case 'icu': return 'ICU';
      case 'basic': return 'Basic';
      case 'transport': return 'Transport';
      default: return type;
    }
  }

  render() {
    return (
      <div class="ambulance-manager">
        <div class="header">
          <h1>Ambulance Management</h1>
          <button 
            class="add-button"
            onClick={() => this.showCreateForm = true}
            disabled={this.loading}
          >
            <span class="material-icons">add</span>
            Add New Ambulance
          </button>
        </div>

        {this.error && (
          <div class="error-message">
            <span class="material-icons">error</span>
            {this.error}
          </div>
        )}

        {this.successMessage && (
          <div class="success-message">
            <span class="material-icons">check_circle</span>
            {this.successMessage}
          </div>
        )}

        {this.loading && (
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        )}

        {this.showCreateForm && (
          <ambulance-form
            onFormSubmit={(event) => this.handleCreate(event.detail)}
            onCancel={() => this.showCreateForm = false}
          />
        )}

        {this.editingAmbulance && (
          <ambulance-form
            ambulance={this.editingAmbulance}
            onFormSubmit={(event) => this.handleUpdate(this.editingAmbulance!.ambulance_id, event.detail)}
            onCancel={() => this.editingAmbulance = null}
          />
        )}

        <div class="ambulances-list">
          {this.ambulances.map(ambulance => (
            <div class="ambulance-card">
              <div class="card-header">
                <h3>{ambulance.name}</h3>
                <span class={`status-badge ${this.getStatusBadgeClass(ambulance.status)}`}>
                  {ambulance.status.replace('_', ' ')}
                </span>
              </div>
              <div class="card-content">
                <p>
                  <span class="material-icons">local_hospital</span>
                  Type: {this.getTypeDisplayName(ambulance.type)}
                </p>
                <p>
                  <span class="material-icons">location_on</span>
                  Location: {ambulance.location}
                </p>
                <p>
                  <span class="material-icons">schedule</span>
                  Created: {new Date(ambulance.created_at).toLocaleDateString()}
                </p>
              </div>
              <div class="card-actions">
                <button 
                  class="edit-button"
                  onClick={() => this.editingAmbulance = ambulance}
                  disabled={this.loading}
                >
                  <span class="material-icons">edit</span>
                  Edit
                </button>
                <button 
                  class="delete-button"
                  onClick={() => this.handleDelete(ambulance.ambulance_id)}
                  disabled={this.loading}
                >
                  <span class="material-icons">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {this.ambulances.length === 0 && !this.loading && (
          <div class="empty-state">
            <span class="material-icons">local_hospital</span>
            <p>No ambulances found. Click "Add New Ambulance" to create one.</p>
          </div>
        )}
      </div>
    );
  }
} 