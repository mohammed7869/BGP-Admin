import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  public appCommon = appCommon;
  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo))
      return true;

    this.router.navigate(['/account/login']);
    return false;
  }
}
