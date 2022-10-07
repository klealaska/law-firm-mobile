// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://192.168.1.69:45455/api/',
  base_url: 'https://192.168.1.69:45455/',
  get baseUrl() {
    return this._apiUrlForImages;
  },
  set baseUrl(value) {
    this._apiUrlForImages = value;
  },
  clientUrl: 'http://localhost:4200/',
  excludeWords: ['të', 'së', 'i', 'për', 'si', 'e', 'dhe', 'as', 'a', 'apo', 'o', 'ose', 'ndaj', 'pa', 'pra', 'sado', 'sido', 'ne', 'pse', 'sikur', 'sa', 'saqë', 'qe', 'as sa', 'po', 'sic', 'por', 'aq', 'se', 'sesa', 'me', 'te', 'sepse', 'prej', 'ku', 'tek', 'kudo', 'ngado', 'tekdo', 'deri', 'gjer', 'para', 'posa', 'dhe të'],
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
