import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private router: Router,
    public toastService: ToastService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.storageService.getAuthToken();
    const clonedReq = this.addHeaders(request, token);
    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401
        ) {
          this.userService.logOut();
          this.router.navigate(['login']);
          this.toastService.presentToast('Unauthorized!');
        }
        return throwError(error);
      })
    );
  }

  private addHeaders(
    request: HttpRequest<any>,
    token?: string
  ): HttpRequest<any> {
    let clone: HttpRequest<any>;
    let header: HttpHeaders = request.headers;

    if (header.get('Accept') === null) {
      // header = header.set('Accept', 'application/json');
    } else {
      header = header.set('Accept', header.get('Accept'));
    }

    if (header.get('Content-type') === null) {
      // header = header.set('Content-type', 'application/json-patch+json');
    } else {
      header = header.set('Content-type', header.get('Content-type'));
    }

    if (token !== null) {
      header = header.set('Authorization', `Bearer ${token}`);
    }

    clone = request.clone({
      headers: header,
      responseType: request.responseType
    });
    return clone;
  }
}
