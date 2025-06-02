import { Component, h, State, Prop } from '@stencil/core';
import { HospitalSpaceService } from '../../utils/hospital-space.service';

@Component({
  tag: 'hospital-dashboard',
  styleUrl: 'hospital-dashboard.css',
  shadow: true,
})
export class HospitalDashboard {
  @Prop() apiBase: string = 'http://localhost:8080/api';
  
  @State() currentView: 'spaces' | 'ambulances' | 'health' = 'spaces';
  @State() healthStatus: { status: string; service: string } | null = null;
  @State() loading = false;
  @State() error: string | null = null;
  
  private spaceService: HospitalSpaceService;

  constructor() {
    this.spaceService = new HospitalSpaceService(this.apiBase);
  }

  async componentWillLoad() {
    await this.checkHealth();
  }

  private async checkHealth() {
    try {
      this.loading = true;
      this.error = null;
      this.healthStatus = await this.spaceService.checkHealth();
    } catch (err) {
      this.error = 'Unable to connect to the API service';
      console.error('Health check failed:', err);
    } finally {
      this.loading = false;
    }
  }

  private setView(view: 'spaces' | 'ambulances' | 'health') {
    this.currentView = view;
  }

  private renderNavigation() {
    return (
      <nav class="dashboard-nav">
        <div class="nav-brand">
          <ion-icon name="medical"></ion-icon>
          <h1>Hospital Management System</h1>
        </div>
        <div class="nav-links">
          <ion-button 
            fill={this.currentView === 'spaces' ? 'solid' : 'clear'}
            class={this.currentView === 'spaces' ? 'nav-button active' : 'nav-button'}
            onClick={() => this.setView('spaces')}
          >
            <ion-icon slot="start" name="bed"></ion-icon>
            Spaces
          </ion-button>
          <ion-button 
            fill={this.currentView === 'ambulances' ? 'solid' : 'clear'}
            class={this.currentView === 'ambulances' ? 'nav-button active' : 'nav-button'}
            onClick={() => this.setView('ambulances')}
          >
            <ion-icon slot="start" name="medical"></ion-icon>
            Ambulances
          </ion-button>
          <ion-button 
            fill={this.currentView === 'health' ? 'solid' : 'clear'}
            class={this.currentView === 'health' ? 'nav-button active' : 'nav-button'}
            onClick={() => this.setView('health')}
          >
            <ion-icon slot="start" name="shield-checkmark"></ion-icon>
            Health
          </ion-button>
        </div>
      </nav>
    );
  }

  private renderHealthView() {
    return (
      <div class="health-view">
        <div class="health-header">
          <h2>API Health Status</h2>
          <ion-button 
            fill="outline"
            class="refresh-button"
            onClick={() => this.checkHealth()}
            disabled={this.loading}
          >
            <ion-icon slot="start" name="refresh"></ion-icon>
            Refresh
          </ion-button>
        </div>
        
        {this.loading && (
          <div class="loading-container">
            <ion-spinner name="circular"></ion-spinner>
            <p>Checking API health...</p>
          </div>
        )}
        
        {this.error && (
          <div class="health-error">
            <ion-icon name="alert-circle"></ion-icon>
            <div>
              <h3>Connection Failed</h3>
              <p>{this.error}</p>
              <p>Please ensure the API server is running at: {this.apiBase}</p>
            </div>
          </div>
        )}
        
        {this.healthStatus && !this.loading && (
          <div class="health-success">
            <ion-icon name="checkmark-circle"></ion-icon>
            <div>
              <h3>API is Healthy</h3>
              <p>Status: {this.healthStatus.status}</p>
              <p>Service: {this.healthStatus.service}</p>
              <p>Endpoint: {this.apiBase}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div class="hospital-dashboard">
        {this.renderNavigation()}
        
        <main class="dashboard-content">
          {this.currentView === 'spaces' && (
            <hospital-space-manager apiBase={this.apiBase}></hospital-space-manager>
          )}
          
          {this.currentView === 'ambulances' && (
            <ambulance-manager apiBase={this.apiBase}></ambulance-manager>
          )}
          
          {this.currentView === 'health' && this.renderHealthView()}
        </main>
      </div>
    );
  }
} 