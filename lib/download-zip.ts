import JSZip from "jszip";

function sanitizeFolderName(name: string): string {
  return name.replace(/[<>:"/\\|?*]+/g, "").trim() || "template";
}

function getExtension(fileType: string): string {
  const type = fileType.toLowerCase().replace(/^\./, "");
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "pdf"].includes(type)) {
    return type;
  }
  return "png";
}

async function fetchBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  return res.blob();
}

export async function downloadTemplateAsZip(opts: {
  name: string;
  downloadUrl: string;
  previewUrl: string;
  fileType: string;
}): Promise<void> {
  const ext = getExtension(opts.fileType);
  const folderName = sanitizeFolderName(opts.name);

  const [templateBlob, previewBlob] = await Promise.all([
    fetchBlob(opts.downloadUrl),
    fetchBlob(opts.previewUrl),
  ]);

  const zip = new JSZip();
  const folder = zip.folder(folderName)!;
  folder.file(`template.${ext}`, templateBlob);
  folder.file(`preview.${ext}`, previewBlob);

  const zipBlob = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
