import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsLayout,
  DocsScreenshot,
} from "@/components/docs/DocsLayout";
import { getPrevNext } from "../../_data/sidebar";

export const metadata: Metadata = {
  title: "Taking photos — BoothIQ Docs",
  description:
    "The capture sequence: countdown, voice prompts, retakes, and what operators should know.",
};

const HREF = "/docs/customer-experience/taking-photos";

const TOC = [
  { id: "the-flow", label: "The flow" },
  { id: "look-at-camera", label: "Look At Camera screen" },
  { id: "template-capture", label: "Template Capture screen" },
  { id: "shapes", label: "Photo area shapes" },
  { id: "retakes", label: "Retakes" },
  { id: "voice-prompts", label: "Voice prompts" },
  { id: "what-you-control", label: "What you control" },
  { id: "what-can-go-wrong", label: "What can go wrong" },
  { id: "idle-behavior", label: "Idle behavior" },
  { id: "what-to-tell", label: "What to tell customers" },
  { id: "common-questions", label: "Common operator questions" },
  { id: "next-steps", label: "Next steps" },
] as const;

export default function TakingPhotosPage() {
  const { prev, next } = getPrevNext(HREF);

  return (
    <DocsLayout toc={[...TOC]} prev={prev} next={next}>
      <h1>Taking photos</h1>

      <p>
        After the customer picks a template, the booth runs the capture
        sequence, which is the actual photo-taking. This article walks
        through what the customer sees and what BoothIQ is doing behind
        the scenes.
      </p>

      <p>
        <strong>Who this is for:</strong> Operators who want to
        understand the capture flow well enough to help customers and
        identify problems.
      </p>

      <h2 id="the-flow">The flow</h2>

      <p>There are two screens involved:</p>

      <ol>
        <li><strong>Look At Camera</strong>. A brief instructional screen with a live camera preview</li>
        <li><strong>Template Capture</strong>. The actual capture sequence with the countdown</li>
      </ol>

      <h3 id="look-at-camera">Look At Camera screen</h3>

      <p>A short &quot;get ready&quot; beat with:</p>

      <ul>
        <li>A live camera preview so the customer can see themselves</li>
        <li>Instructions like &quot;Look at the camera&quot; and &quot;Get ready&quot;</li>
        <li>An automatic advance to the capture screen after a few seconds (or when the customer is ready)</li>
      </ul>

      <p>
        This screen exists so customers don&apos;t get caught off guard
        by the countdown starting immediately.
      </p>

      <DocsScreenshot
        src="look-at-camera-screen.png"
        alt="Look At Camera screen with a live camera preview and a 'get ready' instruction."
      />

      <h3 id="template-capture">Template Capture screen</h3>

      <p>The actual capture sequence. For each photo the template needs:</p>

      <ol>
        <li><strong>Live camera preview</strong> fills most of the screen</li>
        <li><strong>A short delay</strong> (about 1.5 seconds) gives the customer time to pose</li>
        <li><strong>Countdown</strong>. The screen and a voice prompt count down 3, 2, 1, Smile</li>
        <li><strong>Flash</strong>. The screen briefly washes white to confirm the photo was taken (and to give the customer a &quot;did it just happen?&quot; cue)</li>
        <li><strong>Captured photo</strong> appears as a small tab so the customer can see what they got</li>
        <li>If the template needs more photos, the next countdown starts immediately</li>
      </ol>

      <p>
        If the template needs <strong>3 photos</strong>, this loops 3
        times. If it needs <strong>4 photos</strong>, it loops 4 times.
        Templates are designed for specific photo counts (typically 1,
        2, 3, or 4).
      </p>

      <DocsScreenshot
        src="template-capture-screen.png"
        alt="Template capture screen with the countdown overlaying a live camera preview."
      />

      <h2 id="shapes">Photo area shapes</h2>

      <p>
        Different templates use different <strong>photo area shapes</strong>{" "}
        for where each photo will go on the final print:
      </p>

      <ul>
        <li><strong>Rectangle</strong>. Square corners</li>
        <li><strong>Rounded rectangle</strong>. Rounded corners</li>
        <li><strong>Circle</strong>. Perfect circle</li>
        <li><strong>Heart</strong>. Heart shape</li>
        <li><strong>Petal</strong>. Petal / leaf shape</li>
      </ul>

      <p>
        The capture screen shows a visualization of the shape during
        the live preview so customers can frame themselves correctly.
        The capture itself is a normal rectangular photo. BoothIQ crops
        it to the shape during composition.
      </p>

      <h2 id="retakes">Retakes</h2>

      <p>
        If a photo comes out badly, the customer can retake it. The
        exact UI varies by version, but typically:
      </p>

      <ul>
        <li>A <strong>Retake</strong> button appears after each photo, or</li>
        <li>
          A <strong>Retake</strong> option appears on the offer screen
          (see{" "}
          <Link href="/docs/customer-experience/editing-photos">
            Editing photos
          </Link>
          ) once all photos are captured
        </li>
      </ul>

      <p>
        When the customer taps retake, the booth re-runs the capture
        sequence for that specific photo (or for all photos, depending
        on the implementation).
      </p>

      <h2 id="voice-prompts">Voice prompts</h2>

      <p>BoothIQ plays voice prompts during capture:</p>

      <ul>
        <li>&quot;Look at the camera&quot;</li>
        <li>&quot;Three, two, one&quot;</li>
        <li>&quot;Smile!&quot;</li>
        <li>&quot;Got it!&quot;</li>
      </ul>

      <p>
        These help customers who aren&apos;t watching the screen
        carefully (which is most of them, because they&apos;re posing).
      </p>

      <h2 id="what-you-control">What you control</h2>

      <p>
        You don&apos;t control much about the capture flow itself. It&apos;s
        part of the customer experience and operator-configurable
        settings are minimal. What you <strong>can</strong> control:
      </p>

      <ul>
        <li><strong>Camera settings</strong> in the <strong>Diagnostics tab</strong>: brightness, zoom, contrast. Tune these to your venue&apos;s lighting once and forget.</li>
        <li><strong>Which templates</strong> are available in the <strong>Templates tab</strong>. This indirectly controls how many photos each session takes.</li>
        <li><strong>Free Play mode</strong> in the <strong>Settings tab</strong>. Doesn&apos;t affect capture itself but means the customer didn&apos;t pay to start.</li>
      </ul>

      <h2 id="what-can-go-wrong">What can go wrong</h2>

      <h3>Camera disconnects mid-capture</h3>
      <p>
        The booth shows a <strong>Camera Error Screen</strong> with a
        Retry option. The customer&apos;s session is{" "}
        <strong>preserved</strong>. If they paid, their credits are
        still there and they can retry. See <strong>Camera not working</strong>{" "}
        <em>(coming soon)</em>.
      </p>

      <h3>Photo is dark or washed out</h3>
      <p>
        The lighting at the booth is wrong, or the camera settings need
        tuning. Open <strong>Diagnostics → Camera</strong> and adjust
        brightness/contrast. The settings persist across booth restarts.
      </p>

      <h3>The countdown is too fast for the customer to pose</h3>
      <p>
        The countdown timing isn&apos;t operator-configurable in the
        standard release. Tell customers to pose during the{" "}
        <strong>Look At Camera</strong> screen, before the countdown
        even starts.
      </p>

      <h3>The customer wasn&apos;t ready and the photo is bad</h3>
      <p>
        Have them tap retake after the photo, or after the offer screen
        if retake-per-photo isn&apos;t available in their version.
      </p>

      <h2 id="idle-behavior">Idle behavior</h2>

      <p>
        The capture screen has aggressive timeouts to prevent the booth
        from getting stuck on an abandoned session. If the customer
        walks away mid-capture, the booth eventually returns to the
        welcome screen.
      </p>

      <h2 id="what-to-tell">What to tell customers</h2>

      <ul>
        <li>&quot;Stand back so we can see your whole face. About an arm&apos;s length from the camera is good.&quot;</li>
        <li>&quot;Don&apos;t move when the screen flashes. It&apos;s the camera taking the photo.&quot;</li>
        <li>&quot;If the photo looks bad, you can retake it after.&quot;</li>
        <li>For multi-photo strips: &quot;It&apos;s going to take 3 photos in a row. Pose between each one.&quot;</li>
      </ul>

      <h2 id="common-questions">Common operator questions</h2>

      <p><strong>The customer&apos;s photo always comes out blurry.</strong></p>
      <p>The camera autofocus may be confused by the lighting or the customer&apos;s distance. Adjust camera settings in the Diagnostics tab. If it persists across many sessions, the camera may need replacement. Contact support.</p>

      <p><strong>Half the photo is dark.</strong></p>
      <p>Bad lighting on one side of the booth. Adjust the room lighting or the booth&apos;s position.</p>

      <p><strong>The customer says the photo doesn&apos;t match what they saw on screen.</strong></p>
      <p>The live preview is mirrored (like a mirror) but the captured photo is <strong>not</strong> mirrored. That&apos;s standard for booths. Customers usually adjust quickly.</p>

      <p><strong>Customer asks &quot;can I see the photo before I pay?&quot;</strong></p>
      <p>
        Yes. The offer screen after capture (see{" "}
        <Link href="/docs/customer-experience/editing-photos">
          Editing photos
        </Link>
        ) lets them preview the composed print before paying.
      </p>

      <h2 id="next-steps">Next steps</h2>

      <ul>
        <li>
          <Link href="/docs/customer-experience/editing-photos">
            Editing photos
          </Link>
          . The optional editor screen with filters and stickers.
        </li>
        <li><strong>Diagnostics tab</strong> <em>(coming soon)</em>. Where you tune the camera.</li>
      </ul>
    </DocsLayout>
  );
}
