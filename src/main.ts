import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Optional if not using SCSS

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
