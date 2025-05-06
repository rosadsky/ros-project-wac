import { Component, h, State } from '@stencil/core';
import { HospitalSpace, HospitalSpaceCreate, HospitalSpaceUpdate } from '../../utils/hospital-space.model';
import { HospitalSpaceService } from '../../utils/hospital-space.service';

@Component({
  tag: 'hospital-space-manager',
  styleUrl: 'hospital-space-manager.css',
  shadow: true,
})
export class HospitalSpaceManager {
  @State() spaces: HospitalSpace[] = [];
  @State() showCreateForm = false;
  @State() editingSpace: HospitalSpace | null = null;
  @State() loading = false;
  @State() error: string | null = null;
  @State() successMessage: string | null = null;
  private spaceService = new HospitalSpaceService();

  async componentWillLoad() {
    await this.loadSpaces();
  }

  private async loadSpaces() {
    try {
      this.loading = true;
      this.error = null;
      this.spaces = await this.spaceService.getAllSpaces();
    } catch (err) {
      this.error = 'Failed to load spaces. Please try again later.';
      console.error('Error loading spaces:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleCreate(space: HospitalSpaceCreate) {
    try {
      this.loading = true;
      this.error = null;
      await this.spaceService.createSpace(space);
      await this.loadSpaces();
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

  private async handleUpdate(update: HospitalSpaceUpdate) {
    try {
      this.loading = true;
      this.error = null;
      await this.spaceService.updateSpace(update);
      await this.loadSpaces();
      this.editingSpace = null;
      this.successMessage = 'Space updated successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (err) {
      this.error = 'Failed to update space. Please try again.';
      console.error('Error updating space:', err);
    } finally {
      this.loading = false;
    }
  }

  private async handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this space?')) {
      try {
        this.loading = true;
        this.error = null;
        await this.spaceService.deleteSpace(id);
        await this.loadSpaces();
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

  render() {
    return (
      <div class="hospital-space-manager">
        <div class="header">
          <h1>Hospital Space Management</h1>
          <button 
            class="add-button"
            onClick={() => this.showCreateForm = true}
            disabled={this.loading}
          >
            <span class="material-icons">add</span>
            Add New Space
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
          <hospital-space-form
            onFormSubmit={(event) => this.handleCreate(event.detail)}
            onCancel={() => this.showCreateForm = false}
          />
        )}

        {this.editingSpace && (
          <hospital-space-form
            space={this.editingSpace}
            onFormSubmit={(event) => this.handleUpdate({ id: this.editingSpace!.id, ...event.detail })}
            onCancel={() => this.editingSpace = null}
          />
        )}

        <div class="spaces-list">
          {this.spaces.map(space => (
            <div class="space-card">
              <div class="card-header">
                <h3>{space.name}</h3>
                <span class={`status-badge ${space.status.toLowerCase()}`}>
                  {space.status}
                </span>
              </div>
              <div class="card-content">
                <p>
                  <span class="material-icons">height</span>
                  {space.floor}
                </p>
                <p>
                  <span class="material-icons">door_front</span>
                  {space.roomNumber}
                </p>
                <p>
                  <span class="material-icons">category</span>
                  {space.type}
                </p>
                <p>
                  <span class="material-icons">group</span>
                  {space.capacity}
                </p>
                {space.assignedTo && (
                  <p>
                    {space.assignedTo.name}
                  </p>
                )}
              </div>
              <div class="card-actions">
                <button 
                  class="edit-button"
                  onClick={() => this.editingSpace = space}
                  disabled={this.loading}
                >
                  <span class="material-icons">edit</span>
                  Edit
                </button>
                <button 
                  class="delete-button"
                  onClick={() => this.handleDelete(space.id)}
                  disabled={this.loading}
                >
                  <span class="material-icons">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {this.spaces.length === 0 && !this.loading && (
          <div class="empty-state">
            <span class="material-icons">meeting_room</span>
            <p>No spaces found. Click "Add New Space" to create one.</p>
          </div>
        )}
      </div>
    );
  }
} 