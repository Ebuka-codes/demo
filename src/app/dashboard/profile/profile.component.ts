import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'erecruit-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profile$ = this.authService.profile$;
  isLoading$!: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.authService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this.loaderService.setLoading(true);
      } else {
        this.loaderService.setLoading(false);
      }
    });
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
