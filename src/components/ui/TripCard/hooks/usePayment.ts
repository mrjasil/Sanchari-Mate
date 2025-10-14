import { useState, useCallback } from "react";
import { Trip } from "@/types/Trip";
import { useAlert } from "@/hooks/useAlert";

declare global {
	interface Window {
		Razorpay: any;
	}
}

export interface UsePaymentResult {
	loading: boolean;
	startPayment: (trip: Trip, amountPaise: number, onSuccess: () => Promise<void> | void, onError?: (message: string) => void) => Promise<void>;
}

export const usePayment = (): UsePaymentResult => {
	const [loading, setLoading] = useState(false);
	const alert = useAlert();

	const startPayment = useCallback(async (trip: Trip, amountPaise: number, onSuccess: () => Promise<void> | void, onError?: (message: string) => void) => {
		if (typeof window === 'undefined') return;
		if (!window.Razorpay) {
			await alert.error('Payment Error', 'Payment gateway is not loaded. Please refresh the page and try again.');
			return;
		}

		const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
		if (!key) {
			await alert.error('Payment Error', 'Razorpay key not configured.');
			return;
		}

		setLoading(true);
		try {
			const displayAmount = (amountPaise / 100).toFixed(2);
			const options = {
				key,
				amount: amountPaise,
				currency: 'INR',
				name: 'Travel Agency',
				description: `20% advance for ${trip.title}`,
				// Use HTTPS-hosted image to avoid mixed content
				image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Black_colour.jpg',
				handler: async () => {
					try {
						const joinOp = Promise.resolve(onSuccess());
						const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Booking took too long. Please check My Trips.')), 12000));
						await Promise.race([joinOp, timeout]);
						await alert.paymentSuccess(parseFloat(displayAmount), `You have successfully joined ${trip.title}`);
					} catch (e: any) {
						await alert.error('Booking Issue', e?.message || 'We could not confirm booking now. Please check My Trips.');
						onError?.(e?.message || 'Failed to complete booking');
					} finally {
						setLoading(false);
					}
				},
				prefill: {
					name: 'Customer Name',
					email: 'customer@example.com',
					contact: '9999999999',
				},
				notes: { tripId: trip.id, tripTitle: trip.title },
				theme: { color: '#4F46E5' },
			};

			const rzp = new window.Razorpay(options);
			rzp.on('payment.modal.closed', () => setLoading(false));
			rzp.on('payment.failed', async (response: any) => {
				await alert.error('Payment Failed', response?.error?.description || 'Payment failed');
				setLoading(false);
				onError?.(response?.error?.description || 'Payment failed');
			});

			rzp.open();
		} catch (e: any) {
			await alert.error('Payment Error', e?.message || 'Failed to initialize payment gateway');
			setLoading(false);
			onError?.(e?.message || 'Failed to initialize payment gateway');
		}
	}, [alert]);

	return { loading, startPayment };
};


