/**
 * DocsScreenshot
 *
 * Inline screenshot component for docs articles. Renders an image
 * from `/public/docs-screenshots/<filename>` with a caption below.
 *
 * **Key behavior:** when the screenshot file doesn't exist on disk,
 * this component renders a clear placeholder card with the filename
 * and alt text, so:
 *   1. The docs are usable even before screenshots are captured
 *   2. Authors know exactly which file is missing
 *   3. There's no broken `<img>` icon ruining the visual design
 *
 * Once a real screenshot is dropped at `public/docs-screenshots/<filename>`,
 * the placeholder is automatically replaced with the real image — no
 * code change needed.
 *
 * The list of screenshots that need to be captured lives at
 * `docs/website/screenshots-needed.md` (internal file, not rendered).
 *
 * @example
 * <DocsScreenshot
 *   src="welcome.png"
 *   alt="The BoothIQ welcome screen with a glowing START button"
 *   caption="The welcome screen — what every customer sees first."
 * />
 */

import fs from "node:fs";
import Image from "next/image";
import path from "node:path";

interface DocsScreenshotProps {
  /** Filename only — e.g. "welcome.png". Resolved to /public/docs-screenshots/<src>. */
  src: string;
  /** Alt text for accessibility (also shown in the placeholder if the file is missing). */
  alt: string;
  /** Optional caption rendered below the image. */
  caption?: string;
}

export function DocsScreenshot({ src, alt, caption }: DocsScreenshotProps) {
  const publicPath = path.join(
    process.cwd(),
    "public",
    "docs-screenshots",
    src
  );
  const exists = fs.existsSync(publicPath);
  const url = `/docs-screenshots/${src}`;

  if (!exists) {
    return (
      <figure className="not-prose my-8">
        <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#069494]/10 border border-[#069494]/20 mb-4">
            <svg
              className="w-6 h-6 text-[#069494] dark:text-[#0EC7C7]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
            Screenshot needed
          </div>
          <div className="font-mono text-sm text-[var(--foreground)] mb-2">
            {src}
          </div>
          <div className="text-sm text-[var(--muted)] max-w-md mx-auto">
            {alt}
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-[var(--muted)] italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="not-prose my-8">
      <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
        {/* Use unconstrained width/height with a max-width wrapper.
            The Image component requires width+height for static
            optimization; we use generic large numbers and CSS sizes
            it down. */}
        <Image
          src={url}
          alt={alt}
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
