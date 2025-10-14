// lib/alertService.ts
import Swal from 'sweetalert2';

// Success Alerts
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#10B981',
    confirmButtonText: 'OK',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Error Alerts
export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#EF4444',
    confirmButtonText: 'OK',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Warning Alerts
export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#F59E0B',
    confirmButtonText: 'OK',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Info Alerts
export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#3B82F6',
    confirmButtonText: 'OK',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Confirmation Dialogs
export const showConfirmDialog = (
  title: string,
  text: string,
  confirmButtonText: string = 'Yes',
  cancelButtonText: string = 'Cancel'
) => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText,
    cancelButtonText,
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Delete Confirmation
export const showDeleteConfirmation = (itemName: string = 'this item') => {
  return Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert this! ${itemName} will be permanently deleted.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Payment Success
export const showPaymentSuccess = (amount: number, description: string) => {
  return Swal.fire({
    title: 'Payment Successful!',
    html: `
      <div class="text-center">
        <div class="text-green-500 text-6xl mb-4">✓</div>
        <p class="text-gray-600 mb-2">Your payment of <strong>₹${amount}</strong> was successful.</p>
        <p class="text-gray-500 text-sm">${description}</p>
      </div>
    `,
    icon: 'success',
    confirmButtonColor: '#10B981',
    confirmButtonText: 'Continue',
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Loading Alert
export const showLoadingAlert = (title: string = 'Loading...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
    background: '#F9FAFB',
    color: '#374151',
  });
};

// Close any open alert
export const closeAlert = () => {
  Swal.close();
};

