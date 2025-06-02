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
          <ion-button 
            fill="solid"
            color="primary"
            onClick={() => this.showCreateForm = true}
            disabled={this.loading}
          >
            <ion-icon slot="start" name="add"></ion-icon>
            Add New Ambulance
          </ion-button>
        </div>

        {this.error && (
          <ion-alert
            isOpen={!!this.error}
            header="Error"
            message={this.error}
            buttons={['OK']}
            onDidDismiss={() => this.error = null}
          ></ion-alert>
        )}

        {this.successMessage && (
          <ion-toast
            isOpen={!!this.successMessage}
            message={this.successMessage}
            duration={3000}
            color="success"
            onDidDismiss={() => this.successMessage = null}
          ></ion-toast>
        )}

        {this.loading && (
          <div class="loading-overlay">
            <ion-spinner name="crescent"></ion-spinner>
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
            <ion-card>
              <ion-card-header>
                <ion-card-title>{ambulance.name}</ion-card-title>
                <ion-badge color={this.getStatusBadgeColor(ambulance.status)}>
                  {ambulance.status.replace('_', ' ')}
                </ion-badge>
              </ion-card-header>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-icon slot="start" name="medical"></ion-icon>
                  <ion-label>Type: {this.getTypeDisplayName(ambulance.type)}</ion-label>
                </ion-item>
                <ion-item lines="none">
                  <ion-icon slot="start" name="location"></ion-icon>
                  <ion-label>Location: {ambulance.location}</ion-label>
                </ion-item>
                <ion-item lines="none">
                  <ion-icon slot="start" name="time"></ion-icon>
                  <ion-label>Created: {new Date(ambulance.created_at).toLocaleDateString()}</ion-label>
                </ion-item>
                <div class="card-actions">
                  <ion-button 
                    fill="outline"
                    color="medium"
                    onClick={() => this.editingAmbulance = ambulance}
                    disabled={this.loading}
                  >
                    <ion-icon slot="start" name="create"></ion-icon>
                    Edit
                  </ion-button>
                  <ion-button 
                    fill="outline"
                    color="danger"
                    onClick={() => this.handleDelete(ambulance.ambulance_id)}
                    disabled={this.loading}
                  >
                    <ion-icon slot="start" name="trash"></ion-icon>
                    Delete
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          ))}
        </div>

        {this.ambulances.length === 0 && !this.loading && (
          <div class="empty-state">
            <ion-icon name="medical" size="large"></ion-icon>
            <p>No ambulances found. Click "Add New Ambulance" to create one.</p>
          </div>
        )}
      </div>
    );
  }

  private getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'available': return 'success';
      case 'on_duty': return 'primary';
      case 'maintenance': return 'warning';
      case 'out_of_service': return 'danger';
      default: return 'medium';
    }
  }
} 