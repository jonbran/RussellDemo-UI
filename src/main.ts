import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Note: We're now using Font Awesome from CDN in index.html
// No need to initialize it here

bootstrapApplication(AppComponent, appConfig)
  .catch((err: any) => {
    console.error('Application bootstrap error:', err);
    // Display error on page for easier debugging
    const errorElement = document.createElement('div');
    errorElement.style.color = 'red';
    errorElement.style.padding = '20px';
    errorElement.style.margin = '20px';
    errorElement.style.border = '1px solid red';
    errorElement.style.borderRadius = '5px';
    errorElement.style.backgroundColor = '#fff8f8';
    errorElement.innerHTML = `<h3>Angular Application Error</h3><pre>${JSON.stringify(err, null, 2)}</pre>`;
    document.body.appendChild(errorElement);
  });
