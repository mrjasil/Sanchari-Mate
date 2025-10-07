// hooks/useAlert.ts
import { useCallback } from 'react';
import {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showInfoAlert,
  showConfirmDialog,
  showDeleteConfirmation,
  showPaymentSuccess,
  showLoadingAlert,
  closeAlert,
} from '@/lib/alertService';

export const useAlert = () => {
  const success = useCallback((title: string, text?: string) => {
    return showSuccessAlert(title, text);
  }, []);

  const error = useCallback((title: string, text?: string) => {
    return showErrorAlert(title, text);
  }, []);

  const warning = useCallback((title: string, text?: string) => {
    return showWarningAlert(title, text);
  }, []);

  const info = useCallback((title: string, text?: string) => {
    return showInfoAlert(title, text);
  }, []);

  const confirm = useCallback((
    title: string,
    text: string,
    confirmButtonText?: string,
    cancelButtonText?: string
  ) => {
    return showConfirmDialog(title, text, confirmButtonText, cancelButtonText);
  }, []);

  const deleteConfirm = useCallback((itemName?: string) => {
    return showDeleteConfirmation(itemName);
  }, []);

  const paymentSuccess = useCallback((amount: number, description: string) => {
    return showPaymentSuccess(amount, description);
  }, []);

  const loading = useCallback((title?: string) => {
    return showLoadingAlert(title);
  }, []);

  const close = useCallback(() => {
    closeAlert();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    confirm,
    deleteConfirm,
    paymentSuccess,
    loading,
    close,
  };
};