import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  configData: any;
  currentUser: any;
  userInitials: string = '';

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: any, private router: Router, public cookiesService: CookieService) { }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    // Load user data from localStorage
    this.loadUserData();
  }

  /**
   * Load user data from localStorage
   */
  loadUserData() {
    const tokenInfo = localStorage.getItem('tokenInfo');
    if (tokenInfo) {
      try {
        this.currentUser = JSON.parse(tokenInfo);
        this.generateUserInitials();
      } catch (error) {
        console.error('Error parsing tokenInfo from localStorage:', error);
      }
    }
  }

  /**
   * Generate user initials from first name and last name
   */
  generateUserInitials() {
    if (this.currentUser && this.currentUser.user) {
      const firstName = this.currentUser.user.first_Name || '';
      const lastName = this.currentUser.user.lastname || '';

      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();

      this.userInitials = firstInitial + lastInitial;
    }
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    if (this.currentUser && this.currentUser.user) {
      const firstName = this.currentUser.user.first_Name || '';
      const lastName = this.currentUser.user.lastname || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'User';
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Logout the user
   */
  logout() {
    //this.authService.logout();
  }
}
