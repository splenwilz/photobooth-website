/**
 * Docs sidebar — single source of truth.
 *
 * Lists every published doc article in display order. The sidebar
 * component renders this directly, and `getPrevNext` walks the
 * flattened list to compute the bottom-of-page navigation.
 *
 * Sections that haven't been written yet are intentionally absent —
 * we surface them on the /docs landing page card grid with a
 * "coming soon" badge instead, but they don't appear in the sidebar
 * to avoid 404 links.
 *
 * To add a new section after Phase 1: append a new entry to
 * `sidebarSections` with its `items` array.
 */

export interface SidebarItem {
  title: string;
  href: string;
}

export interface SidebarSection {
  /** Section title shown above the items. */
  title: string;
  /** URL of the section's index page. */
  href: string;
  /** Articles in this section, in display order. */
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    items: [
      {
        title: "What is BoothIQ?",
        href: "/docs/getting-started/what-is-boothiq",
      },
      {
        title: "How it works",
        href: "/docs/getting-started/how-it-works",
      },
      {
        title: "Site and venue requirements",
        href: "/docs/getting-started/system-requirements",
      },
      {
        title: "What's in the box",
        href: "/docs/getting-started/what-is-in-the-box",
      },
      {
        title: "First-time setup",
        href: "/docs/getting-started/first-time-setup",
      },
      {
        title: "First login and password",
        href: "/docs/getting-started/first-login-and-password",
      },
      {
        title: "Your first print",
        href: "/docs/getting-started/your-first-print",
      },
    ],
  },
  {
    title: "Connecting Your Kiosk",
    href: "/docs/connecting-your-kiosk",
    items: [
      {
        title: "Connecting to Wi-Fi",
        href: "/docs/connecting-your-kiosk/connecting-to-wifi",
      },
      {
        title: "Cloud registration",
        href: "/docs/connecting-your-kiosk/cloud-registration",
      },
      {
        title: "License and activation",
        href: "/docs/connecting-your-kiosk/license-and-activation",
      },
      {
        title: "Testing your connection",
        href: "/docs/connecting-your-kiosk/testing-your-connection",
      },
    ],
  },
  {
    title: "Customer Experience",
    href: "/docs/customer-experience",
    items: [
      {
        title: "Welcome screen",
        href: "/docs/customer-experience/welcome-screen",
      },
      {
        title: "Choosing a product",
        href: "/docs/customer-experience/choosing-a-product",
      },
      {
        title: "Picking a template",
        href: "/docs/customer-experience/picking-a-template",
      },
      {
        title: "Taking photos",
        href: "/docs/customer-experience/taking-photos",
      },
      {
        title: "Editing photos",
        href: "/docs/customer-experience/editing-photos",
      },
      {
        title: "Extra prints and cross-sell",
        href: "/docs/customer-experience/extra-prints-and-cross-sell",
      },
      {
        title: "Paying",
        href: "/docs/customer-experience/paying",
      },
      {
        title: "Printing and thank you",
        href: "/docs/customer-experience/printing-and-thank-you",
      },
      {
        title: "Phone upload feature",
        href: "/docs/customer-experience/phone-upload-feature",
      },
    ],
  },
  {
    title: "Admin Dashboard",
    href: "/docs/admin-dashboard",
    items: [
      {
        title: "Accessing admin mode",
        href: "/docs/admin-dashboard/accessing-admin",
      },
      {
        title: "Dashboard overview",
        href: "/docs/admin-dashboard/dashboard-overview",
      },
      {
        title: "Sales & Analytics tab",
        href: "/docs/admin-dashboard/sales-tab",
      },
      {
        title: "Credits tab",
        href: "/docs/admin-dashboard/credits-tab",
      },
      {
        title: "Products tab",
        href: "/docs/admin-dashboard/products-tab",
      },
      {
        title: "Templates tab",
        href: "/docs/admin-dashboard/templates-tab",
      },
      {
        title: "Layouts tab",
        href: "/docs/admin-dashboard/layouts-tab",
      },
      {
        title: "Settings tab",
        href: "/docs/admin-dashboard/settings-tab",
      },
      {
        title: "Diagnostics tab",
        href: "/docs/admin-dashboard/diagnostics-tab",
      },
      {
        title: "Cloud Sync tab",
        href: "/docs/admin-dashboard/cloud-sync-tab",
      },
      {
        title: "WiFi tab",
        href: "/docs/admin-dashboard/wifi-tab",
      },
    ],
  },
  {
    title: "Running Your Booth",
    href: "/docs/running-your-booth",
    items: [
      {
        title: "Daily startup checklist",
        href: "/docs/running-your-booth/daily-startup-checklist",
      },
      {
        title: "Pricing strategy",
        href: "/docs/running-your-booth/pricing-strategy",
      },
      {
        title: "Managing templates and categories",
        href: "/docs/running-your-booth/managing-templates-and-categories",
      },
      {
        title: "Operation modes",
        href: "/docs/running-your-booth/operation-modes",
      },
      {
        title: "Adding credits manually",
        href: "/docs/running-your-booth/adding-credits-manually",
      },
      {
        title: "Exporting sales data",
        href: "/docs/running-your-booth/exporting-sales-data",
      },
      {
        title: "Managing business info and logo",
        href: "/docs/running-your-booth/managing-business-info",
      },
      {
        title: "Handling customer issues",
        href: "/docs/running-your-booth/handling-customer-issues",
      },
    ],
  },
  {
    title: "Cloud and Fleet",
    href: "/docs/cloud-and-fleet",
    items: [
      {
        title: "What cloud sync does",
        href: "/docs/cloud-and-fleet/what-cloud-sync-does",
      },
      {
        title: "Working offline",
        href: "/docs/cloud-and-fleet/working-offline",
      },
      {
        title: "Remote commands",
        href: "/docs/cloud-and-fleet/remote-commands",
      },
      {
        title: "Cloud features overview",
        href: "/docs/cloud-and-fleet/cloud-features",
      },
    ],
  },
  {
    title: "Maintenance",
    href: "/docs/maintenance",
    items: [
      {
        title: "Daily checks",
        href: "/docs/maintenance/daily-checks",
      },
      {
        title: "Changing the print roll",
        href: "/docs/maintenance/changing-the-print-roll",
      },
      {
        title: "Cleaning the printer",
        href: "/docs/maintenance/cleaning-the-printer",
      },
      {
        title: "Camera care",
        href: "/docs/maintenance/camera-care",
      },
      {
        title: "Coin and bill acceptor care",
        href: "/docs/maintenance/coin-acceptor-care",
      },
      {
        title: "Software updates",
        href: "/docs/maintenance/software-updates",
      },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    items: [
      {
        title: "Booth frozen or blank",
        href: "/docs/troubleshooting/booth-frozen-or-blank",
      },
      {
        title: "Camera not working",
        href: "/docs/troubleshooting/camera-not-working",
      },
      {
        title: "Printer issues",
        href: "/docs/troubleshooting/printer-issues",
      },
      {
        title: "Payment not registering",
        href: "/docs/troubleshooting/payment-not-registering",
      },
      {
        title: "Cloud sync not working",
        href: "/docs/troubleshooting/cloud-sync-not-working",
      },
      {
        title: "Locked out of admin",
        href: "/docs/troubleshooting/locked-out-of-admin",
      },
      {
        title: "Phone upload not working",
        href: "/docs/troubleshooting/phone-upload-not-working",
      },
      {
        title: "Reading error screens",
        href: "/docs/troubleshooting/reading-error-screens",
      },
      {
        title: "Out-of-order screen won't go away",
        href: "/docs/troubleshooting/out-of-order-screen",
      },
    ],
  },
  {
    title: "Security and Compliance",
    href: "/docs/security-and-compliance",
    items: [
      {
        title: "Admin account best practices",
        href: "/docs/security-and-compliance/admin-account-best-practices",
      },
      {
        title: "The master password system",
        href: "/docs/security-and-compliance/master-password-system",
      },
      {
        title: "Data and privacy",
        href: "/docs/security-and-compliance/data-and-privacy",
      },
      {
        title: "Physical security",
        href: "/docs/security-and-compliance/physical-security",
      },
    ],
  },
  {
    title: "Reference",
    href: "/docs/reference",
    items: [
      {
        title: "Glossary",
        href: "/docs/reference/glossary",
      },
      {
        title: "Default credentials",
        href: "/docs/reference/default-credentials",
      },
      {
        title: "Supported hardware",
        href: "/docs/reference/supported-hardware",
      },
      {
        title: "Idle timeouts",
        href: "/docs/reference/timeouts",
      },
      {
        title: "Where things live",
        href: "/docs/reference/file-locations",
      },
      {
        title: "Tab and button map",
        href: "/docs/reference/tab-and-button-map",
      },
    ],
  },
  {
    title: "FAQ",
    href: "/docs/faq",
    items: [],
  },
];

/**
 * Flatten all section index pages and items into a single ordered
 * list. Used by `getPrevNext` to find the neighbors of a given URL.
 */
function flattenAll(): SidebarItem[] {
  const flat: SidebarItem[] = [];
  for (const section of sidebarSections) {
    flat.push({ title: section.title, href: section.href });
    flat.push(...section.items);
  }
  return flat;
}

/**
 * Compute the previous/next page for a given href. Returns null for
 * either side if the current page is at the start/end of the docs.
 *
 * If the href isn't found in the sidebar (e.g. it's the /docs landing
 * page itself), both prev and next are null.
 */
export function getPrevNext(currentHref: string): {
  prev: SidebarItem | null;
  next: SidebarItem | null;
} {
  const flat = flattenAll();
  const index = flat.findIndex((item) => item.href === currentHref);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
