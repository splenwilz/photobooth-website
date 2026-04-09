import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Camera care — BoothIQ Docs",
  description:
    "Keeping the kiosk camera lens clean and the camera firmly mounted.",
};

const HREF = "/docs/maintenance/camera-care";

const TOC = [
  { id: "how-often", label: "How often to clean" },
  { id: "tools", label: "Tools you'll need" },
  { id: "step-1", label: "Step 1: Locate the camera" },
  { id: "step-2", label: "Step 2: Inspect the lens" },
  { id: "step-3", label: "Step 3: Brush off dust" },
  { id: "step-4", label: "Step 4: Clean the lens" },
  { id: "step-5", label: "Step 5: Test the camera" },
  { id: "position", label: "Camera position" },
  { id: "lighting", label: "Lighting around the camera" },
  { id: "common-problems", label: "Common problems" },
  { id: "what-not", label: "What NOT to do" },
  { id: "support", label: "When to call support" },
  { id: "verify", label: "Verify it worked" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function CameraCarePage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Camera care</h1>

      <p>
        The camera is the customer&apos;s window into the booth. If
        its lens is dirty or the camera has shifted, every photo will
        be worse. This article covers routine camera care.
      </p>

      <p><strong>Who this is for:</strong> Operators doing routine maintenance.</p>

      <h2 id="how-often">How often to clean</h2>

      <ul>
        <li><strong>Heavy</strong> (event venue, 100+ sessions/day). Once a week</li>
        <li><strong>Medium</strong> (steady traffic). Once a month</li>
        <li><strong>Light</strong> (occasional use). Once every 2-3 months</li>
        <li><strong>After visible smudges or fingerprints.</strong> Immediately</li>
      </ul>

      <p>Customers often touch the camera area accidentally. Clean whenever you notice fingerprints.</p>

      <h2 id="tools">Tools you&apos;ll need</h2>

      <ul>
        <li><strong>Microfiber cloth</strong> (the kind that comes with eyeglasses or lens cleaning kits)</li>
        <li><strong>Lens cleaning fluid</strong> (the kind made for camera lenses or eyeglasses). <strong>Optional</strong></li>
        <li><strong>A soft brush</strong> for dust. Optional</li>
        <li><strong>No paper towels, no T-shirts, no household cloth.</strong> They scratch the lens</li>
      </ul>

      <h2 id="step-1">Step 1: Locate the camera</h2>

      <p>The camera is mounted inside the kiosk enclosure, behind the touchscreen. From the outside, you&apos;ll see the camera&apos;s lens through a small opening. This is the only camera-related part you should touch from the outside.</p>

      <h2 id="step-2">Step 2: Inspect the lens</h2>

      <p>Look at the lens. You may see:</p>

      <ul>
        <li>Dust (gray flecks)</li>
        <li>Fingerprints (oily smudges)</li>
        <li>Spots (water droplets, sneezes, food)</li>
        <li>Scratches (these are permanent. Don&apos;t try to clean them off)</li>
      </ul>

      <h2 id="step-3">Step 3: Brush off dust (if needed)</h2>

      <p>If there&apos;s loose dust on the lens, <strong>gently</strong> brush it off with a soft brush before wiping. Wiping dust around with a cloth can scratch the lens.</p>

      <h2 id="step-4">Step 4: Clean the lens</h2>

      <ol>
        <li><strong>Dampen</strong> the microfiber cloth with a tiny amount of lens cleaning fluid. <strong>Never</strong> apply fluid directly to the lens.</li>
        <li><strong>Lightly</strong> wipe the lens in a circular motion from center to edge.</li>
        <li>Use a <strong>dry</strong> part of the cloth to remove any remaining streaks.</li>
        <li>Inspect the lens. It should be clear and free of smudges.</li>
      </ol>

      <h2 id="step-5">Step 5: Test the camera</h2>

      <ol>
        <li>Sign in to admin → <strong>Diagnostics</strong> tab.</li>
        <li>Find the Camera section.</li>
        <li>Use the <strong>Test Capture</strong> button to take a test photo.</li>
        <li>Look at the result. The image should be sharp and clear with no smudges, halos, or discoloration.</li>
      </ol>

      <p>If the test capture shows smudges, clean again. If smudges persist or the image is hazy across the whole frame, the lens may be scratched or there may be an internal issue. Contact support.</p>

      <h2 id="position">Camera position</h2>

      <p>The camera is mounted at a fixed position inside the kiosk, aimed at where customers stand for their photos. Over time, vibration or movement of the kiosk can shift the camera slightly out of alignment.</p>

      <p>You can&apos;t manually adjust the camera mounting from the outside. It&apos;s an internal component. If you suspect the camera has shifted (photos are consistently off-center, customers are partially out of frame), contact support.</p>

      <h2 id="lighting">Lighting around the camera</h2>

      <p>The camera works best with <strong>even, indirect lighting</strong> at customer face level. Lighting issues you can fix yourself:</p>

      <ul>
        <li><strong>Bright window or spotlight behind customers</strong> → silhouettes. Move the booth or block the light.</li>
        <li><strong>Pitch dark venue</strong> → blurry, noisy photos. Add ambient light at the booth.</li>
        <li><strong>Mixed colored lights</strong> (e.g. red disco lights) → weird color casts. Customers expect this at events; not a real problem.</li>
      </ul>

      <h2 id="common-problems">Common problems</h2>

      <p><strong>Hazy photos.</strong></p>
      <p>Dirty lens. Clean it.</p>

      <p><strong>Sharp photos but customers look pale.</strong></p>
      <p>Lighting too bright. Adjust camera brightness in Diagnostics.</p>

      <p><strong>Sharp photos but customers look orange.</strong></p>
      <p>Mixed color lighting. Customers usually accept this; not a real fix.</p>

      <p><strong>Customer cut off at the top of frame.</strong></p>
      <p>Camera angle, or customer too tall. Mark a &quot;stand here&quot; spot on the floor at the right distance.</p>

      <p><strong>Customer cut off at the side.</strong></p>
      <p>Camera angle drifted. Contact support.</p>

      <p><strong>Black photos.</strong></p>
      <p>Camera offline. See <strong>Camera not working</strong> <em>(coming soon)</em>.</p>

      <h2 id="what-not">What NOT to do</h2>

      <ul>
        <li><strong>Don&apos;t</strong> spray cleaning fluid directly onto the lens</li>
        <li><strong>Don&apos;t</strong> use rough cloth or paper</li>
        <li><strong>Don&apos;t</strong> scrub hard</li>
        <li><strong>Don&apos;t</strong> open the kiosk enclosure to access the camera physically</li>
        <li><strong>Don&apos;t</strong> unplug the camera&apos;s USB cable</li>
        <li><strong>Don&apos;t</strong> stick anything into the camera opening other than a soft cloth</li>
      </ul>

      <h2 id="support">When to call support</h2>

      <ul>
        <li>The camera lens is visibly cracked or scratched</li>
        <li>Cleaning doesn&apos;t fix hazy / dark photos</li>
        <li>The camera angle is wrong and you can&apos;t adjust it</li>
        <li>The Camera pill in admin is consistently red</li>
      </ul>

      <h2 id="verify">Verify it worked</h2>

      <p>Camera care is done when:</p>

      <ul>
        <li>The lens is visibly clean</li>
        <li>A test capture in Diagnostics is sharp and well-exposed</li>
        <li>A test customer session produces good photos</li>
      </ul>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/admin-dashboard/diagnostics-tab">Diagnostics tab</Link>
          . Where you tune camera brightness and contrast.
        </li>
        <li><strong>Camera not working</strong> <em>(coming soon)</em>. When cleaning doesn&apos;t fix the issue.</li>
      </ul>
    </DocsLayout>
  );
}
