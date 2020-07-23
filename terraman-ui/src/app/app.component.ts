import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ClimateService } from './core/services/climate/climate.service';
import { 
  faPowerOff,
  faHome,
  faCogs
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  faPowerOff = faPowerOff;
  faHome = faHome;
  faCogs = faCogs;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private climateService: ClimateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  climate() {
    this.router.navigate(['climate']);
  }

  schedule() {
    this.router.navigate(['schedule']);
  }

  exit() {
    this.climateService.exit();
  }
}
