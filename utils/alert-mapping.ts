/**
 * Alert Mapping Utilities
 *
 * Functions to transform between API (snake_case) and app (camelCase) formats.
 */

import type { Alert as ApiAlert } from "@/core/api/alerts/types";
import type { Alert as AppAlert } from "@/types/photobooth";

/**
 * Transform API alert (snake_case) to app alert (camelCase)
 *
 * @param apiAlert - Alert from API response
 * @returns Alert in app format
 */
export function mapAlertsApiAlertToAppAlert(apiAlert: ApiAlert): AppAlert {
	return {
		id: apiAlert.id,
		type: apiAlert.type,
		severity: apiAlert.severity,
		category: apiAlert.category,
		title: apiAlert.title,
		message: apiAlert.message,
		boothId: apiAlert.booth_id,
		boothName: apiAlert.booth_name,
		timestamp: apiAlert.timestamp,
		isRead: apiAlert.is_read,
	};
}

/**
 * Transform app alert (camelCase) to API alert (snake_case)
 *
 * @param appAlert - Alert in app format
 * @returns Alert for API request
 */
export function mapAppAlertToAlertsApiAlert(appAlert: AppAlert): ApiAlert {
	return {
		id: appAlert.id,
		type: appAlert.type,
		severity: appAlert.severity,
		category: appAlert.category,
		title: appAlert.title,
		message: appAlert.message,
		booth_id: appAlert.boothId,
		booth_name: appAlert.boothName,
		timestamp: appAlert.timestamp,
		is_read: appAlert.isRead,
	};
}
