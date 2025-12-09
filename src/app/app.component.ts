import { Component, OnInit } from '@angular/core';
import { TenantConfigService } from './core/services/tenant-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nazox';

  constructor(private tenantConfigService: TenantConfigService) {}

  ngOnInit() {
    // Subscribe to tenant configuration changes
    this.tenantConfigService.currentConfig$.subscribe(config => {
      if (config) {
        this.title = config.title;
        // Update document title
        document.title = config.title;
      }
    });
  }
}
