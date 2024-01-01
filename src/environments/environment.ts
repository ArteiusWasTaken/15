// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import Swal from "sweetalert2";

export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

export const backend_url =
  "https://arteiuswastaken.github.io/sorteo-back-main/";
// export const backend_url = "http://localhost:8000/";

export function swalErrorHttpResponse(err) {
  Swal.fire({
    title: err.title,
    icon: "error",
    html:
      err.status == 0
        ? err.message
        : typeof err.error === "object"
        ? err.error.error_summary
          ? err.error.error_summary
          : err.error.message
        : err.error,
  });
}

export function swalSuccessHttpResponse(res) {
  Swal.fire(res.title, "", "success");
}
