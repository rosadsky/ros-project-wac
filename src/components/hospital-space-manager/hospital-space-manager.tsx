import { Component, h, State, Prop } from '@stencil/core';
import { HospitalSpace, HospitalSpaceCreate, HospitalSpaceUpdate } from '../../utils/hospital-space.model';
import { Ambulance } from '../../utils/ambulance.model';
import { HospitalSpaceService } from '../../utils/hospital-space.service';
import { AmbulanceService } from '../../utils/ambulance.service';

@Component({
  tag: 'hospital-space-manager',
  styleUrl: 'hospital-space-manager.css',
  shadow: true,
})
export class HospitalSpaceManager {
  @Prop() apiBase: string = 'http://localhost:8080/api';
  
  @State() spaces: HospitalSpace[] = [];
  @State() ambulances: Ambulance[] = [];
  @State() showCreateForm = false;
  @State() editingSpace: HospitalSpace | null = null;
  @State() assigningSpace: HospitalSpace | null = null;
  @State() loading = false;
  @State() error: string | null = null;
  @State() successMessage: string | null = null;
  
  private spaceService: HospitalSpaceService;
  private ambulanceService: AmbulanceService;

  constructor() {
    this.spaceService = new HospitalSpaceService(this.apiBase);
    this.ambulanceService = new AmbulanceService(this.apiBase);
  }

  async componentWillLoad() {
    await this.loadData();
  }

  private async loadData() {
    try {
      this.loading = true;
      this.error = null;
      
      const [spacesResult, ambulancesResult] = await Promise.all([
        this.spaceService.getAllSpaces(),
        this.ambulanceService.getAllAmbulances()
      ]);
      
      this.spaces = spacesResult;
      this.ambulances = ambulancesResult;
    } catch (err) {
      this.error = 'Failed to load data. Please try again later.';
      console.error('Error loading data:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleCreate(space: HospitalSpaceCreate) {
    try {
      this.loading = true;
      this.error = null;
      await this.spaceService.createSpace(space);
      await this.loadData();
      this.showCreateForm = false;
      this.successMessage = 'Space created successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (err) {
      this.error = 'Failed to create space. Please try again.';
      console.error('Error creating space:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleAssignment(spaceId: string, update: HospitalSpaceUpdate) {
    try {
      this.loading = true;
      this.error = null;
      await this.spaceService.updateSpaceAssignment(spaceId, update);
      await this.loadData();
      this.assigningSpace = null;
      this.successMessage = 'Space assignment updated successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (err) {
      this.error = 'Failed to update space assignment. Please try again.';
      console.error('Error updating space assignment:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleDelete(spaceId: string) {
    if (confirm('Are you sure you want to delete this space?')) {
      try {
        this.loading = true;
        this.error = null;
        await this.spaceService.deleteSpace(spaceId);
        await this.loadData();
        this.successMessage = 'Space deleted successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      } catch (err) {
        this.error = 'Failed to delete space. Please try again.';
        console.error('Error deleting space:', err);
      } finally {
        this.loading = false;
      }
    }
  }

  private getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-unknown';
    }
  }

  private getTypeDisplayName(type: string): string {
    switch (type) {
      case 'operating_room': return 'Operating Room';
      case 'emergency_room': return 'Emergency Room';
      case 'ward': return 'Ward';
      case 'icu': return 'ICU';
      case 'consultation_room': return 'Consultation Room';
      default: return type;
    }
  }

  private renderAssignmentModal() {
    if (!this.assigningSpace) return null;

    return (
      <div class="modal-overlay" onClick={() => this.assigningSpace = null}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3>Assign Space: {this.assigningSpace.name}</h3>
            <ion-button 
              fill="clear" 
              class="close-button" 
              onClick={() => this.assigningSpace = null}
            >
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </div>
          
          <div class="modal-body">
            <div class="assignment-options">
              <ion-button 
                fill="outline"
                class="assignment-button"
                onClick={() => this.handleAssignment(this.assigningSpace!.space_id, {
                  assigned_to: null,
                  assigned_type: null,
                  assigned_id: null
                })}
              >
                <ion-icon slot="start" name="close"></ion-icon>
                Clear Assignment
              </ion-button>
              
              <div class="ambulance-list">
                <h4>Assign to Ambulance:</h4>
                {this.ambulances.map(ambulance => (
                  <ion-button 
                    fill="outline"
                    class="ambulance-assignment-button"
                    onClick={() => this.handleAssignment(this.assigningSpace!.space_id, {
                      assigned_to: ambulance.name,
                      assigned_type: 'ambulance',
                      assigned_id: ambulance.ambulance_id
                    })}
                  >
                    <ion-icon slot="start" name="medical"></ion-icon>
                    <div>
                      <div class="ambulance-name">{ambulance.name}</div>
                      <div class="ambulance-details">{ambulance.type} - {ambulance.location}</div>
                    </div>
                  </ion-button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="hospital-space-manager">
        <div class="header">
          <h1>Hospital Space Management</h1>
          <ion-button 
            onClick={() => this.showCreateForm = true}
            disabled={this.loading}
          >
            <ion-icon slot="start" name="add"></ion-icon>
            Add New Space
          </ion-button>
        </div>

        {this.error && (
          <div class="error-message">
            <ion-icon name="alert-circle"></ion-icon>
            {this.error}
          </div>
        )}

        {this.successMessage && (
          <div class="success-message">
            <ion-icon name="checkmark-circle"></ion-icon>
            {this.successMessage}
          </div>
        )}

        {this.loading && (
          <div class="loading-overlay">
            <ion-spinner name="circular"></ion-spinner>
          </div>
        )}

        {this.showCreateForm && (
          <hospital-space-form
            onFormSubmit={(event) => this.handleCreate(event.detail)}
            onCancel={() => this.showCreateForm = false}
          />
        )}

        {this.editingSpace && (
          <hospital-space-form
            space={this.editingSpace}
            onFormSubmit={(event) => this.handleCreate(event.detail)}
            onCancel={() => this.editingSpace = null}
          />
        )}

        {this.renderAssignmentModal()}

        <div class="spaces-list">
          {this.spaces.map(space => (
            <ion-card class="space-card">
              <ion-card-header class="card-header">
                <ion-card-title>{space.name}</ion-card-title>
                <ion-badge class={this.getStatusBadgeClass(space.status)}>
                  {space.status}
                </ion-badge>
              </ion-card-header>
              <ion-card-content class="card-content">
                <p>
                  <ion-icon name="business"></ion-icon>
                  Floor {space.floor}
                </p>
                <p>
                  <ion-icon name="apps"></ion-icon>
                  {this.getTypeDisplayName(space.type)}
                </p>
                <p>
                  <ion-icon name="people"></ion-icon>
                  Capacity: {space.capacity}
                </p>
                {space.assigned_to && (
                  <p class="assignment-info">
                    <ion-icon name="clipboard"></ion-icon>
                    Assigned to: {space.assigned_to} ({space.assigned_type})
                  </p>
                )}
              </ion-card-content>
              <div class="card-actions">
                <ion-button 
                  fill="outline"
                  class="assign-button"
                  onClick={() => this.assigningSpace = space}
                  disabled={this.loading}
                >
                  <ion-icon slot="start" name="clipboard"></ion-icon>
                  Assign
                </ion-button>
                <ion-button 
                  fill="outline"
                  color="danger"
                  class="delete-button"
                  onClick={() => this.handleDelete(space.space_id)}
                  disabled={this.loading}
                >
                  <ion-icon slot="start" name="trash"></ion-icon>
                  Delete
                </ion-button>
              </div>
            </ion-card>
          ))}
        </div>

        {this.spaces.length === 0 && !this.loading && (
          <div class="empty-state">
            <ion-icon name="business"></ion-icon>
            <p>No spaces found. Click "Add New Space" to create one.</p>
          </div>
        )}
      </div>
    );
  }
} 