import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Picking a template — BoothIQ Docs",
  description:
    "The template selection screen: categories, seasonal templates, the carousel, and the three style modes for strips.",
};

const HREF = "/docs/customer-experience/picking-a-template";

const TOC = [
  { id: "whats-on-screen", label: "What's on the screen" },
  { id: "what-customers-do", label: "What customers do" },
  { id: "categories", label: "Categories" },
  { id: "style-modes", label: "The three style modes" },
  { id: "previews", label: "Template previews" },
  { id: "premium-badges", label: "Premium badges" },
  { id: "what-you-control", label: "What you control" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function PickingATemplatePage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Picking a template</h1>

      <p>
        After choosing a product (strips or 4×6), the customer lands on
        the <strong>template selection screen</strong>. This is where
        they pick the visual design that will frame their photos.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand how the carousel works and how to curate what
        customers see.
      </p>

      <h2 id="whats-on-screen">What&apos;s on the screen</h2>

      <ul>
        <li>A <strong>windowed carousel</strong> showing 4 templates at a time</li>
        <li><strong>Category buttons</strong> at the top to filter the carousel by category (e.g. Classic, Birthday, Holiday)</li>
        <li><strong>Mode buttons</strong> (for Photo Strips only). Templates / Black &amp; White / Color</li>
        <li><strong>Left and right arrows</strong> to scroll the carousel</li>
        <li>A <strong>template preview image</strong> for each template</li>
        <li><strong>Premium badges</strong> on premium templates</li>
        <li>The credits indicator in the corner</li>
        <li>A <strong>Continue</strong> or <strong>Select</strong> button to confirm the highlighted template</li>
        <li>A <strong>Back</strong> button to return to the product selection screen</li>
      </ul>

      <DocsScreenshot
        src="template-selection-screen.png"
        alt="Template selection screen with a windowed carousel of templates and category buttons across the top."
      />

      <h2 id="what-customers-do">What customers do</h2>

      <ol>
        <li>Browse the carousel by tapping the left/right arrows.</li>
        <li>(Optional) Tap a category button at the top to filter to a specific category.</li>
        <li>(Optional, photo strips only) Tap a mode button to switch between Templates / Black &amp; White / Color.</li>
        <li>Tap a template to highlight it.</li>
        <li>Tap <strong>Continue</strong> to confirm.</li>
      </ol>

      <p>
        The booth advances to the <strong>Look At Camera</strong> screen
        and starts the capture sequence.
      </p>

      <h2 id="categories">Categories</h2>

      <p>
        Templates are organized into <strong>categories</strong>.
        Categories show as buttons at the top of the screen. Customers
        tap a category to filter the carousel, so only templates in that
        category appear.
      </p>

      <p>Categories you might see by default:</p>

      <ul>
        <li><strong>Classic</strong></li>
        <li><strong>Birthday</strong></li>
        <li><strong>Holiday</strong></li>
        <li><strong>Wedding</strong></li>
        <li><strong>Custom</strong></li>
        <li>...whatever your operator has set up</li>
      </ul>

      <h3>Seasonal categories</h3>

      <p>
        Some categories are <strong>seasonal</strong>. They have a date
        range and only appear during that range. For example, a
        &quot;Christmas&quot; category configured for{" "}
        <code>12-01</code> to <code>01-15</code> will:
      </p>

      <ul>
        <li>Be <strong>visible</strong> on December 1 through January 15</li>
        <li>Be <strong>hidden</strong> the rest of the year</li>
      </ul>

      <p>
        This means a Christmas category disappears in February without
        you having to do anything, and reappears next December
        automatically.
      </p>

      <p>Cross-year ranges (December into January) are supported.</p>

      <p>
        Operators manage categories in <strong>Templates tab</strong>{" "}
        <em>(coming soon)</em> and <strong>Running Your Booth › Managing templates and categories</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="style-modes">The three style modes (Photo Strips only)</h2>

      <p>
        For Photo Strips, the template selection screen also shows three{" "}
        <strong>mode buttons</strong> at the top:
      </p>

      <ul>
        <li><strong>Templates</strong>. The template design as-is, full color</li>
        <li><strong>Black &amp; White</strong>. The same design with a B&amp;W filter applied to the composed image</li>
        <li><strong>Color</strong>. The same design with your business logo placed in a designated photo area on the template</li>
      </ul>

      <p>
        Each mode produces a different print style from the same
        template selection. Not every template supports Color mode, only
        those with a designated logo area.
      </p>

      <DocsCallout type="note">
        <strong>What does &quot;Color&quot; mode actually do?</strong>{" "}
        When the template author marked a photo area as the &quot;logo
        area&quot; for Color mode, that area is filled with your
        business logo (uploaded in <strong>Settings → Business Logo</strong>)
        instead of a customer photo. The other photo areas still get
        customer photos. This gives you a branded print without
        sacrificing photo content.
      </DocsCallout>

      <h2 id="previews">Template previews</h2>

      <p>
        Each template in the carousel shows a <strong>preview image</strong>,
        a thumbnail of what the final print will look like. Customers
        tap the preview to highlight the template and see a larger
        version.
      </p>

      <p>For accuracy:</p>

      <ul>
        <li>The preview image is set by whoever created the template (usually a designer or your BoothIQ contact)</li>
        <li>BoothIQ doesn&apos;t auto-generate previews. What you see is what was uploaded</li>
        <li>If a preview is missing or broken, the template card shows a placeholder</li>
      </ul>

      <h2 id="premium-badges">Premium badges</h2>

      <p>
        Templates marked as <strong>premium</strong> in the admin
        Templates tab show a small badge on their card in the carousel.
        The badge is visual only. It does not automatically charge a
        higher price. If you want to charge more for premium templates,
        contact your BoothIQ point of contact.
      </p>

      <h2 id="what-you-control">What you control</h2>

      <p>In the <strong>Templates tab</strong> (Admin → Templates):</p>

      <ul>
        <li><strong>Which templates are enabled.</strong> Disabled templates don&apos;t appear in the carousel at all</li>
        <li><strong>Which category</strong> each template belongs to</li>
        <li><strong>Whether each template is marked premium</strong></li>
        <li><strong>Which photos</strong> the template uses (its layout)</li>
      </ul>

      <p>In the <strong>Category Management modal</strong> (reached from the Templates tab):</p>

      <ul>
        <li><strong>Category names</strong></li>
        <li><strong>Sort order</strong> of categories</li>
        <li><strong>Active / inactive flag</strong> per category</li>
        <li><strong>Seasonal date ranges</strong></li>
      </ul>

      <p>
        For details on how to use these controls, see{" "}
        <strong>Templates tab</strong> <em>(coming soon)</em> and{" "}
        <strong>Managing templates and categories</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The template selection screen times out after{" "}
        <strong>about 60 seconds</strong> of no input. The booth shows
        a warning and then returns to the welcome screen if the
        customer doesn&apos;t interact.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <p>If a customer is overwhelmed by template choices:</p>

      <ul>
        <li>&quot;Use the category buttons at the top to narrow it down.&quot;</li>
        <li>&quot;Just pick one. The photos themselves are the same. The template is just the background design.&quot;</li>
      </ul>

      <p>If a customer wants a B&amp;W look on their strip:</p>

      <ul>
        <li>&quot;Tap the Black &amp; White button at the top. It gives you the same template in black and white.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>A template I uploaded doesn&apos;t appear.</strong></p>
      <ul>
        <li>Check that it&apos;s enabled in the Templates tab.</li>
        <li>Check that its category is active and (if seasonal) currently in season.</li>
        <li>Force a cloud sync if it came from the cloud.</li>
      </ul>

      <p><strong>The carousel only shows 4 templates at a time. Can I see more?</strong></p>
      <p>The carousel is windowed for performance and visual clarity. Use the left/right arrows to scroll through more.</p>

      <p><strong>Customers say the previews don&apos;t match the prints.</strong></p>
      <p>The preview image is uploaded separately from the template&apos;s actual print file. If they don&apos;t match, the preview file is wrong. Contact support or your template designer.</p>

      <p><strong>Color mode doesn&apos;t work on every template.</strong></p>
      <p>Only templates whose author marked a specific photo area as the &quot;logo area&quot; support Color mode. Plain templates don&apos;t have a logo area defined and don&apos;t show the Color mode option.</p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/taking-photos">
            Taking photos
          </Link>
          . The capture sequence after the customer picks a template.
        </li>
        <li><strong>Templates tab</strong> <em>(coming soon)</em>. Where operators manage templates.</li>
      </ul>
    </DocsLayout>
  );
}
