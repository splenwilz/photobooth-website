/**
 * DocsCallout
 *
 * Note / Tip / Important / Warning admonition box. Used inline in
 * docs articles to highlight asides, gotchas, and prerequisites.
 *
 * Server component. Pass children as the body content (paragraphs,
 * lists, links — anything inline).
 *
 * @example
 * <DocsCallout type="note">
 *   The booth runs offline by default.
 * </DocsCallout>
 *
 * <DocsCallout type="warning" title="Don't skip this">
 *   Power-cycle the booth before continuing.
 * </DocsCallout>
 */

type CalloutType = "note" | "tip" | "important" | "warning";

interface DocsCalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const STYLES: Record<
  CalloutType,
  {
    border: string;
    bg: string;
    iconColor: string;
    titleColor: string;
    iconPath: string;
    defaultTitle: string;
  }
> = {
  note: {
    border: "border-[#069494]/30",
    bg: "bg-[#069494]/5",
    iconColor: "text-[#069494] dark:text-[#0EC7C7]",
    titleColor: "text-[#069494] dark:text-[#0EC7C7]",
    iconPath:
      "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    defaultTitle: "Note",
  },
  tip: {
    border: "border-[#10B981]/30",
    bg: "bg-[#10B981]/5",
    iconColor: "text-[#10B981]",
    titleColor: "text-[#10B981]",
    iconPath:
      "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
    defaultTitle: "Tip",
  },
  important: {
    border: "border-[#F59E0B]/30",
    bg: "bg-[#F59E0B]/5",
    iconColor: "text-[#F59E0B]",
    titleColor: "text-[#F59E0B]",
    iconPath:
      "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
    defaultTitle: "Important",
  },
  warning: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    iconColor: "text-red-500",
    titleColor: "text-red-500",
    iconPath:
      "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z",
    defaultTitle: "Warning",
  },
};

export function DocsCallout({
  type = "note",
  title,
  children,
}: DocsCalloutProps) {
  const style = STYLES[type];
  const displayTitle = title ?? style.defaultTitle;

  return (
    <div
      className={`not-prose my-6 rounded-xl border ${style.border} ${style.bg} p-5`}
    >
      <div className="flex items-start gap-3">
        <svg
          className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={style.iconPath}
          />
        </svg>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm mb-1.5 ${style.titleColor}`}>
            {displayTitle}
          </div>
          <div className="text-sm text-[var(--foreground-secondary)] leading-relaxed [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_a]:text-[#069494] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
