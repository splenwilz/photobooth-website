/**
 * Shared template upload orchestration.
 *
 * Both admin (/templates) and me (/me/templates) follow the same 3-step
 * presign → S3 PUT → POST record dance, only differing in which
 * presign/create functions get called and what request shape they accept.
 * Centralizing the orchestration here keeps the S3 upload logic
 * single-sourced.
 */

import { uploadFileToS3 } from "./admin-services";
import type { AdminPresignRequest, AdminPresignResponse } from "./admin-types";

interface TemplateUploadFlowArgs<TCreateRequest, TCreateResponse> {
	templateFile: File;
	previewFile: File;
	overlayFile?: File;
	metadata: Omit<
		TCreateRequest,
		"template_s3_key" | "preview_s3_key" | "overlay_s3_key"
	>;
	presignFn: (req: AdminPresignRequest) => Promise<AdminPresignResponse>;
	createFn: (req: TCreateRequest) => Promise<TCreateResponse>;
}

/**
 * Step 1: presign → Step 2: parallel S3 PUT → Step 3: create record.
 */
export async function runTemplateUploadFlow<TCreateRequest, TCreateResponse>({
	templateFile,
	previewFile,
	overlayFile,
	metadata,
	presignFn,
	createFn,
}: TemplateUploadFlowArgs<
	TCreateRequest,
	TCreateResponse
>): Promise<TCreateResponse> {
	const presignRequest: AdminPresignRequest = {
		template_filename: templateFile.name,
		preview_filename: previewFile.name,
	};
	if (overlayFile) {
		presignRequest.overlay_filename = overlayFile.name;
	}
	const presign = await presignFn(presignRequest);

	if (overlayFile && (!presign.overlay_upload_url || !presign.overlay_s3_key)) {
		throw new Error(
			"Overlay upload failed: server did not return overlay upload credentials. Please try again or contact support.",
		);
	}

	const uploads: Promise<void>[] = [
		uploadFileToS3(presign.template_upload_url, templateFile),
		uploadFileToS3(presign.preview_upload_url, previewFile),
	];
	if (overlayFile) {
		uploads.push(uploadFileToS3(presign.overlay_upload_url!, overlayFile));
	}
	await Promise.all(uploads);

	const createPayload = {
		...metadata,
		template_s3_key: presign.template_s3_key,
		preview_s3_key: presign.preview_s3_key,
		file_size: templateFile.size,
		...(overlayFile ? { overlay_s3_key: presign.overlay_s3_key } : {}),
	} as TCreateRequest;

	return createFn(createPayload);
}

interface TemplateUpdateUploadFlowArgs<TUpdateRequest> {
	templateFile?: File;
	previewFile?: File;
	overlayFile?: File;
	removeOverlay?: boolean;
	basePayload: TUpdateRequest;
	presignFn: (req: AdminPresignRequest) => Promise<AdminPresignResponse>;
}

/**
 * Build a PATCH payload for an update flow that may replace one or more files.
 * Returns the payload (with any new s3 keys merged in) — caller invokes the
 * actual PATCH.
 */
export async function buildUpdateUploadPayload<
	TUpdateRequest extends {
		template_s3_key?: string;
		preview_s3_key?: string;
		overlay_s3_key?: string | null;
	},
>({
	templateFile,
	previewFile,
	overlayFile,
	removeOverlay,
	basePayload,
	presignFn,
}: TemplateUpdateUploadFlowArgs<TUpdateRequest>): Promise<TUpdateRequest> {
	if (removeOverlay && overlayFile) {
		throw new Error(
			"Cannot set both removeOverlay and overlayFile: the requested update is ambiguous. Pass one or the other.",
		);
	}

	const updatePayload: TUpdateRequest = { ...basePayload };

	// Strip any s3_key fields that leaked in via basePayload. They belong
	// on the wire only when their corresponding file was actually uploaded
	// in this update; the existing logic re-adds them below from the
	// presign response.
	delete updatePayload.template_s3_key;
	delete updatePayload.preview_s3_key;
	delete updatePayload.overlay_s3_key;

	if (removeOverlay) {
		updatePayload.overlay_s3_key = null;
	}

	if (!templateFile && !previewFile && !overlayFile) {
		return updatePayload;
	}

	// When only overlay is being replaced, the backend still requires
	// template_filename + preview_filename (they are typed `string`, not
	// `string?`). We send "unused.png" sentinels; the server returns S3 keys
	// for them that we ignore (no S3 PUT happens for the missing files
	// below). TODO: when the backend exposes optional filenames, build this
	// request conditionally.
	const presignRequest: AdminPresignRequest = {
		template_filename: templateFile?.name ?? "unused.png",
		preview_filename: previewFile?.name ?? "unused.png",
	};
	if (overlayFile) {
		presignRequest.overlay_filename = overlayFile.name;
	}
	const presign = await presignFn(presignRequest);

	if (overlayFile && (!presign.overlay_upload_url || !presign.overlay_s3_key)) {
		throw new Error(
			"Overlay upload failed: server did not return overlay upload credentials. Please try again or contact support.",
		);
	}

	const uploads: Promise<void>[] = [];
	if (templateFile) {
		uploads.push(uploadFileToS3(presign.template_upload_url, templateFile));
	}
	if (previewFile) {
		uploads.push(uploadFileToS3(presign.preview_upload_url, previewFile));
	}
	if (overlayFile) {
		uploads.push(uploadFileToS3(presign.overlay_upload_url!, overlayFile));
	}
	await Promise.all(uploads);

	if (templateFile) updatePayload.template_s3_key = presign.template_s3_key;
	if (previewFile) updatePayload.preview_s3_key = presign.preview_s3_key;
	if (overlayFile) updatePayload.overlay_s3_key = presign.overlay_s3_key;

	return updatePayload;
}
