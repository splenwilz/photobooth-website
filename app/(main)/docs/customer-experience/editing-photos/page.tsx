import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Editing photos — BoothIQ Docs",
  description:
    "The optional photo editor: filters, stickers, intensity slider, and the skip path.",
};

const HREF = "/docs/customer-experience/editing-photos";

const TOC = [
  { id: "offer-screen", label: "The offer screen" },
  { id: "the-editor", label: "The photo editor" },
  { id: "filters", label: "Filters" },
  { id: "stickers", label: "Stickers" },
  { id: "what-you-control", label: "What you control" },
  { id: "skip-path", label: "The skip path" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "after-editing", label: "What customers see after editing" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function EditingPhotosPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Editing photos</h1>

      <p>
        After taking the photos, BoothIQ shows a brief{" "}
        <strong>offer screen</strong> with three options:{" "}
        <strong>Edit</strong>, <strong>Continue</strong>, or{" "}
        <strong>Retake</strong>. If the customer taps{" "}
        <strong>Edit</strong>, they get a full photo editor with filters
        and stickers. Most customers skip it.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to know
        what&apos;s in the editor and how customers use it.
      </p>

      <h2 id="offer-screen">The offer screen</h2>

      <p>
        Right after the last photo is captured, the booth shows a
        preview of the composed print and three big buttons:
      </p>

      <ul>
        <li><strong>Edit</strong>. Opens the photo editor</li>
        <li><strong>Continue</strong>. Accept the print as-is and move to the extra-prints / payment flow</li>
        <li><strong>Retake</strong>. Go back and re-shoot all the photos</li>
      </ul>

      <p>
        If the customer doesn&apos;t tap anything within about 60
        seconds, the booth shows a warning and then auto-continues so
        the session doesn&apos;t get stuck.
      </p>

      <DocsScreenshot
        src="photo-offer-screen.png"
        alt="Photo offer screen showing a preview of the composed print with Edit, Continue, and Retake buttons."
      />

      <h2 id="the-editor">The photo editor</h2>

      <p>
        When the customer taps <strong>Edit</strong>, the editor opens.
        It has two main sections:
      </p>

      <ul>
        <li><strong>Filters</strong>. Instagram-style preset filters (around 24 presets) with a swipe interface and an intensity slider</li>
        <li><strong>Stickers</strong>. Emoji overlays the customer can drag, resize, and rotate</li>
      </ul>

      <p>The customer switches between the two via tabs.</p>

      <DocsScreenshot
        src="photo-editor-filters.png"
        alt="Photo editor with a filter strip across the bottom and an intensity slider."
      />

      <h2 id="filters">Filters</h2>

      <p>The filter section lets the customer:</p>

      <ol>
        <li><strong>Swipe left/right</strong> through filter presets (around 24 of them)</li>
        <li>See a <strong>live preview</strong> of the filter applied to their composed photo</li>
        <li>Adjust the <strong>intensity slider</strong> (0-100%, default about 75%) to make the filter stronger or weaker</li>
      </ol>

      <p>
        Each filter is a complete look: vintage tones, cool tones, warm
        tones, dramatic, soft, and so on. The swipe interface keeps it
        easy to compare without committing.
      </p>

      <p>
        The filter is applied to the <strong>composed photo</strong>{" "}
        (with all the template&apos;s photos and frame), not to
        individual photos. So if the template uses 3 photos in a strip,
        the same filter applies to all 3 the same way.
      </p>

      <DocsCallout type="note">
        The list of filters is fixed and not operator-configurable. If
        you want a different filter set, contact your BoothIQ point of
        contact.
      </DocsCallout>

      <h2 id="stickers">Stickers</h2>

      <p>
        The sticker section lets the customer add{" "}
        <strong>emoji overlays</strong> to their composed photo. The
        exact emoji set is fixed (around 24 emojis). For each sticker:
      </p>

      <ul>
        <li><strong>Tap an emoji</strong> to add it to the photo</li>
        <li><strong>Drag</strong> to move it</li>
        <li><strong>Pinch</strong> or use the resize handles to scale it</li>
        <li><strong>Rotate</strong> it with a rotation gesture</li>
        <li><strong>Tap to delete</strong> (or use a delete button)</li>
      </ul>

      <p>
        The customer can add <strong>up to 10 stickers</strong> per
        photo. After 10, the kiosk stops adding new ones until the
        customer removes some.
      </p>

      <DocsScreenshot
        src="photo-editor-stickers.png"
        alt="Photo editor with stickers being placed on a composed print."
      />

      <h2 id="what-you-control">What you control</h2>

      <p>
        The editor itself is not really operator-configurable. The
        filters and emoji are fixed, the intensity slider is fixed at
        0-100, and the max-stickers cap is fixed.
      </p>

      <p>What you can control:</p>

      <ul>
        <li><strong>Whether the editor exists at all.</strong> There&apos;s no toggle to disable it, but you can talk to your BoothIQ point of contact if you want a custom build with the editor disabled.</li>
      </ul>

      <h2 id="skip-path">The skip path</h2>

      <p>
        The vast majority of customers don&apos;t edit. They tap{" "}
        <strong>Continue</strong> on the offer screen and skip the
        editor entirely. That&apos;s by design. Editing is optional.
      </p>

      <p>
        If you ever feel the editor is{" "}
        <strong>slowing down the line at peak times</strong>, tell
        customers to skip it. &quot;Tap Continue, the photos look great
        as-is.&quot;
      </p>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The editor screen has a longer timeout than most other screens
        (about <strong>120 seconds</strong>) because customers
        sometimes spend real time playing with filters. After the
        timeout, the booth warns and then auto-advances to the next
        screen.
      </p>

      <h2 id="after-editing">What customers see after editing</h2>

      <p>
        When the customer is done editing, they tap a{" "}
        <strong>Done</strong> or <strong>Save</strong> button (the
        exact label depends on the version). The booth applies the
        filter and stickers to the composed photo and advances to the{" "}
        <strong>extra prints / cross-sell</strong> screen (see{" "}
        <Link href="/docs/customer-experience/extra-prints-and-cross-sell">
          Extra prints and cross-sell
        </Link>
        ).
      </p>

      <p>
        If they tap <strong>Cancel</strong> or <strong>Back</strong> in
        the editor, the changes are discarded and they go back to the
        offer screen.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <ul>
        <li>&quot;You can add a filter or stickers if you want, or just tap Continue to skip.&quot;</li>
        <li>&quot;Swipe through the filters to see how they look. The slider underneath makes them stronger or weaker.&quot;</li>
        <li>&quot;For stickers, tap an emoji, then drag it where you want it.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>The editor is laggy when customers add many stickers.</strong></p>
      <p>The booth caches filter previews for performance, but stickers still cost compute. If customers consistently add 10 stickers and the editor lags, this is a known limitation. Encourage them to use fewer.</p>

      <p><strong>Customers ask if they can add their own emoji.</strong></p>
      <p>No, the emoji set is fixed.</p>

      <p><strong>Customers ask if they can crop photos.</strong></p>
      <p>Cropping happens automatically based on the template&apos;s photo area shape. Customers don&apos;t have manual crop controls in the standard editor.</p>

      <p><strong>Customers ask to undo a filter.</strong></p>
      <p>Swiping back to the leftmost filter (usually labeled &quot;None&quot; or &quot;Original&quot;) removes the filter.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/extra-prints-and-cross-sell">
            Extra prints and cross-sell
          </Link>
          . What customers see after editing.
        </li>
        <li><strong>Pricing strategy</strong> <em>(coming soon)</em>. How the editor screen affects perceived value.</li>
      </ul>
    </DocsLayout>
  );
}
