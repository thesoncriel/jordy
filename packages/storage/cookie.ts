import { CookieService } from './storage.type';

export const cookie: CookieService = {
  set(key: string, value: string, expireDays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = key + '=' + value + ';' + expires + ';path=/';
  },
  get(key: string) {
    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },
  remove(key: string) {
    document.cookie = key + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  },
};
