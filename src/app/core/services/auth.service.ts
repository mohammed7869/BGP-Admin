import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public appCommon = appCommon;

  constructor(private afAuth: AngularFireAuth,
    private localStorageServiceService: LocalStorageService,
    private router: Router,
  ) { }

  public currentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(res => res.user);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(res => res.user);
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logout() {
    this.router.navigate(['/account/login']);
    this.localStorageServiceService.removeItem(this.appCommon.LocalStorageKeyType.TokenInfo);
  }
}

