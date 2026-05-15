export {};

declare global {
	interface Window {
		__GADS_ID?: string;
		__META_PIXEL_ID?: string;
		__PH_CONFIG?: {
			key: string;
			host?: string;
			api_host?: string;
		};
		dataLayer?: any[];
		gtag?: (...args: any[]) => void;
		fbq?: (...args: any[]) => void;
		_fbq?: (...args: any[]) => void;
		posthog?: any;
	}
}
