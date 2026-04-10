import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsCallout,
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Layouts tab — BoothIQ Docs",
  description:
    "A tour of the Layouts tab: the photo-area positioning that templates use.",
};

const HREF = "/docs/admin-dashboard/layouts-tab";

const TOC = [
  { id: "what-this-tab", label: "What this tab is for" },
  { id: "layout-vs-template", label: "A layout vs a template" },
  { id: "layout-list", label: "Layout list" },
  { id: "creating", label: "Creating a new layout" },
  { id: "shapes", label: "Photo area shapes" },
  { id: "editing", label: "Editing an existing layout" },
  { id: "built-in", label: "Built-in layouts are read-only" },
  { id: "verify", label: "Verify it worked" },
  { id: "common-problems", label: "Common problems" },
  { id: "caution", label: "Words of caution" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function LayoutsTabPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Layouts tab</h1>

      <p>
        A <strong>layout</strong> is the underlying photo-area
        structure that a template uses. Where templates are about
        visual design (background art, frame, branding), layouts are
        about geometry: how many photos there are, where they go,
        what shape they are, and how they&apos;re rotated.
      </p>

      <p>
        <strong>Who this is for:</strong> Advanced operators or
        designers who want to create custom layouts. Most operators
        won&apos;t need this tab. The layouts that ship with BoothIQ
        cover the common cases.
      </p>

      <h2 id="what-this-tab">What this tab is for</h2>

      <ul>
        <li>Browse the list of available layouts</li>
        <li>Create new custom layouts</li>
        <li>Edit photo area positions, sizes, rotations, and shapes</li>
        <li>Set border radius and border colors for photo areas</li>
        <li>Preview a layout in a canvas view</li>
        <li>Save changes</li>
      </ul>

      <h2 id="layout-vs-template">A layout vs a template, what&apos;s the difference?</h2>

      <p>
        <strong>Layout:</strong> defines the geometry. Number of
        photos, position, size, rotation, shape. Reusable across many
        templates. Created in the <strong>Layouts</strong> tab.
        Example: &quot;3-photo strip with circular photo areas.&quot;
      </p>

      <p>
        <strong>Template:</strong> defines the design. Background art,
        frame, colors, branding. Uses one layout. Created in the{" "}
        <strong>Templates</strong> tab (or from the cloud library).
        Example: &quot;Holiday strip with snowflakes, using the
        3-circle layout.&quot;
      </p>

      <p>
        When customers pick a template in the carousel, they&apos;re
        picking a <em>design</em>. The geometry comes from whatever
        layout that template references.
      </p>

      <h2 id="layout-list">Layout list</h2>

      <p>The Layouts tab shows a list of all installed layouts. Each entry shows:</p>

      <ul>
        <li>The layout <strong>name</strong> (e.g. <code>Strip-3-Shot-Circle</code>)</li>
        <li>The number of <strong>photo areas</strong> it has</li>
        <li>A <strong>canvas dimensions</strong> indicator (width × height)</li>
        <li>An <strong>edit</strong> button</li>
        <li>A <strong>delete</strong> button (for non-built-in layouts)</li>
      </ul>

      <p>
        Built-in layouts that ship with BoothIQ are usually{" "}
        <strong>protected from edit and delete</strong> so operators
        can&apos;t break the templates that depend on them. You&apos;ll
        be able to view their geometry but not modify it.
      </p>

      <DocsScreenshot
        src="layouts-tab-list.png"
        alt="Layouts tab list with installed layouts and their photo area counts."
      />

      <h2 id="creating">Creating a new layout</h2>

      <p>To create a custom layout from scratch:</p>

      <ol>
        <li>Find the <strong>New Layout</strong> (or similar) button.</li>
        <li>Give the layout a <strong>name</strong>. Make it descriptive (e.g. <code>4x6-2-Photo-Heart</code>).</li>
        <li>Set the <strong>canvas dimensions</strong> in pixels. For prints this should match your target output (e.g. 1803×1206 for a 4×6 at 300 DPI).</li>
        <li>
          Add photo areas one at a time:
          <ul>
            <li><strong>X / Y position</strong>. Top-left corner</li>
            <li><strong>Width / Height</strong></li>
            <li><strong>Rotation</strong>. Degrees</li>
            <li><strong>Border radius</strong>. For rounded corners</li>
            <li><strong>Shape type</strong></li>
          </ul>
        </li>
        <li>Save.</li>
      </ol>

      <h2 id="shapes">Photo area shapes</h2>

      <p>
        Each photo area has a <strong>shape type</strong> that
        determines how the customer&apos;s photo gets cropped to fit:
      </p>

      <ul>
        <li><strong>Rectangle</strong>. Square corners</li>
        <li><strong>RoundedRectangle</strong>. Square shape with rounded corners (controlled by border radius)</li>
        <li><strong>Circle</strong>. Perfect circle</li>
        <li><strong>Heart</strong>. Heart shape</li>
        <li><strong>Petal</strong>. Petal / leaf shape</li>
      </ul>

      <p>Pick the shape that matches the template design you&apos;re going to put on top.</p>

      <h2 id="editing">Editing an existing layout</h2>

      <p>For non-built-in layouts:</p>

      <ol>
        <li>Tap the layout&apos;s <strong>Edit</strong> button.</li>
        <li>The 3-column edit view opens: layout list on the left, edit form in the middle, canvas preview on the right.</li>
        <li>Click any photo area in the canvas to select it.</li>
        <li>Modify its position, size, rotation, shape, or border in the edit form.</li>
        <li>The canvas preview updates as you type.</li>
        <li>Tap <strong>Save</strong> when you&apos;re done.</li>
      </ol>

      <DocsScreenshot
        src="layouts-tab-edit.png"
        alt="Layouts tab edit view with the layout list, edit form, and canvas preview."
      />

      <h2 id="built-in">Built-in layouts are read-only</h2>

      <p>
        Layouts marked as built-in (the ones that come with BoothIQ)
        cannot be edited or deleted. This is by design. Many templates
        depend on them, and editing one would break every template
        that uses it.
      </p>

      <p>
        If you need a variant of a built-in layout, <strong>duplicate</strong>{" "}
        it (if your version supports duplication) or{" "}
        <strong>create a new layout from scratch</strong> with the
        same geometry plus your changes.
      </p>

      <h2 id="verify">Verify it worked</h2>

      <p>You can use the Layouts tab effectively when you can:</p>

      <ul>
        <li>Find a specific layout by name</li>
        <li>Open a layout in the edit view and read its geometry</li>
        <li>(For non-built-in layouts) edit a photo area and see the canvas preview update</li>
        <li>Save changes without errors</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Edit / Delete buttons are disabled.</strong></p>
      <p>The layout is built-in and protected. Create a new layout instead of editing.</p>

      <p><strong>Canvas preview doesn&apos;t update.</strong></p>
      <p>The form has invalid values (negative width, etc.). Fix the invalid value and try again.</p>

      <p><strong>Templates referencing a layout I edited look broken.</strong></p>
      <p>You changed the geometry in a way that doesn&apos;t match the template design. Revert your changes or update the template to match.</p>

      <p><strong>New layout doesn&apos;t appear in the Templates tab dropdown.</strong></p>
      <p>The cache hasn&apos;t refreshed. Exit and re-enter admin.</p>

      <h2 id="caution">Words of caution</h2>

      <DocsCallout type="warning">
        Editing layouts is an <strong>advanced operation</strong>. The
        geometry you set is what every dependent template will use
        forever, and there&apos;s no easy &quot;preview against a real
        template&quot; feature in this tab. If you&apos;re unsure,
        leave layouts alone and ask your BoothIQ point of contact to
        make custom ones for you.
      </DocsCallout>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/templates-tab">Templates tab</Link>
          . Manage templates that reference these layouts.
        </li>
        <li>
          <Link href="/docs/admin-dashboard/settings-tab">Settings tab</Link>
          . Other admin configuration.
        </li>
      </ul>
    </DocsLayout>
  );
}
