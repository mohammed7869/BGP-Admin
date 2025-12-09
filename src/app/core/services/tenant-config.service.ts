import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TenantConfig {
  tenantId: number | null;
  companyCode: string | null;
  companyName: string;
  logo: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {
  private currentConfigSubject = new BehaviorSubject<TenantConfig | null>(null);
  public currentConfig$ = this.currentConfigSubject.asObservable();

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    const config = this.detectTenantConfig();
    this.currentConfigSubject.next(config);

    // Update document title
    if (config.title) {
      document.title = config.title;
    }
  }

  private detectTenantConfig(): TenantConfig {
    // Check if config.js is loaded
    if (typeof window !== 'undefined' && (window as any).APP_CONFIG) {
      const appConfig = (window as any).APP_CONFIG;
      const currentHost = window.location.hostname;

      // Check if current host matches any tenant configuration
      if (appConfig.tenants && appConfig.tenants[currentHost]) {
        return appConfig.tenants[currentHost];
      }
    }

    // Return default configuration if no tenant match found
    return {
      tenantId: null,
      companyCode: null,
      companyName: "Baawan",
      logo: "assets/images/logo-dark.png",
      title: "Baawan CMS",
    };
  }

  getCurrentConfig(): TenantConfig | null {
    return this.currentConfigSubject.value;
  }

  getTenantId(): number | null {
    return this.currentConfigSubject.value?.tenantId || null;
  }

  getCompanyCode(): string | null {
    return this.currentConfigSubject.value?.companyCode || null;
  }

  getCompanyName(): string {
    return this.currentConfigSubject.value?.companyName || "Baawan";
  }

  getLogo(): string {
    return this.currentConfigSubject.value?.logo || "assets/images/logo-dark.png";
  }

  getTitle(): string {
    return this.currentConfigSubject.value?.title || "Baawan CMS";
  }

  isTenantConfigured(): boolean {
    const config = this.currentConfigSubject.value;
    return config !== null && config.tenantId !== null && config.companyCode !== null;
  }

  // Method to manually set configuration (useful for testing or dynamic updates)
  setConfig(config: TenantConfig): void {
    this.currentConfigSubject.next(config);
    if (config.title) {
      document.title = config.title;
    }
  }
}
