import {  ElMessage , ElMessageBox, ElNotification, ElLoading } from 'element-plus';

let loadingInstance;

export default {
  // Message prompt
  
  msg(content) {
      ElMessage({
      message: 'Congrats, this is a success message.',
      type: 'success',
    });
  },
  // Error message
  msgError(content) {
    ElMessage.error(content);
  },
  // Success message
  msgSuccess(content) {
    ElMessage.success(content);
  },
  // Warning message
  msgWarning(content) {
    ElMessage.warning(content);
  },
  // Alert prompt
  alert(content) {
    ElMessageBox.alert(content, "System Prompt");
  },
  // Error prompt
  alertError(content) {
    ElMessageBox.alert(content, "System Prompt", { type: 'error' });
  },
  // Success prompt
  alertSuccess(content) {
    ElMessageBox.alert(content, "System Prompt", { type: 'success' });
  },
  // Warning prompt
  alertWarning(content) {
    ElMessageBox.alert(content, "System Prompt", { type: 'warning' });
  },
  // Notification prompt
  notify(content) {
    ElNotification.info({ title: "System Prompt", message: content });
  },
  // Error notification
  notifyError(content) {
    console.log(content)
    // ElNotification.error({ title: "System Prompt", message: content });
     ElNotification({
    title: 'System Prompt',
    message: content.en,
    type: 'error',
  })
  },
  // Success notification
  notifySuccess(content) {
    ElNotification.success({ title: "System Prompt", message: content });
  },
  // Warning notification
  notifyWarning(content) {
    ElNotification.warning({ title: "System Prompt", message: content });
  },
  // Confirmation dialog
  confirm(content) {
    return ElMessageBox.confirm(content, "System Prompt", {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: "warning",
    });
  },
  // Submit content
  prompt(content) {
    return ElMessageBox.prompt(content, "System Prompt", {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: "warning",
    });
  },
  // Open loading overlay
  loading(content) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  },
  // Close loading overlay
  closeLoading() {
    loadingInstance.close();
  }
};
