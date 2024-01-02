import Swal from "sweetalert2";

export const environment = {
  production: true,
};

export const backend_url = "https://devployers.tech/";
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
