import Swal from "sweetalert2";

const philUpSwal = Swal.mixin({
  background: "#fffbf4",
  color: "#1c618c",
  confirmButtonColor: "#1c618c",
  cancelButtonColor: "#e53535",
  customClass: {
    popup: "philup-swal-popup",
    title: "philup-swal-title",
    htmlContainer: "philup-swal-text",
    confirmButton: "philup-swal-confirm",
    cancelButton: "philup-swal-cancel",
  },
});

export const showSuccess = (title, text = "") => {
  return philUpSwal.fire({
    icon: "success",
    title,
    text,
  });
};

export const showError = (title, text = "") => {
  return philUpSwal.fire({
    icon: "error",
    title,
    text,
  });
};

export const showWarning = (title, text = "") => {
  return philUpSwal.fire({
    icon: "warning",
    title,
    text,
  });
};

export const showInfo = (title, text = "") => {
  return philUpSwal.fire({
    icon: "info",
    title,
    text,
  });
};

export const showConfirm = (title, text = "", confirmText = "Yes") => {
  return philUpSwal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });
};