export interface TourStep {
  id: string;
  /** CSS selector to find the target element, or null for a center modal */
  target: string | null;
  title: string;
  description: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
  /** If true, step is skipped on mobile where sidebar is hidden */
  requiresSidebar?: boolean;
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to BoothIQ!",
    description:
      "Let's take a quick tour of your dashboard. We'll show you where everything is so you can manage your booths with confidence.",
    placement: "center",
  },
  {
    id: "sidebar",
    target: '[data-tour-id="sidebar-nav"]',
    title: "Your Navigation Hub",
    description:
      "The sidebar gives you quick access to every part of your booth management system, organized by what you use most.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "nav-booths",
    target: '[data-tour-id="nav-booths"]',
    title: "Booth Management",
    description:
      "View, add, and manage all your booths. Track status, register new kiosks, and manage subscriptions from here.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "nav-analytics",
    target: '[data-tour-id="nav-analytics"]',
    title: "Analytics",
    description:
      "Dive deep into revenue charts, transaction breakdowns, and trends across your fleet.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "nav-alerts",
    target: '[data-tour-id="nav-alerts"]',
    title: "Alerts",
    description:
      "Hardware failures, low paper, offline booths. Critical issues surface here so you can act fast.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "booth-selector",
    target: '[data-tour-id="booth-selector"]',
    title: "Booth Selector",
    description:
      "Filter your entire dashboard by a specific booth, or select \"All Booths\" to see aggregated data across your fleet.",
    placement: "bottom",
    requiresSidebar: true,
  },
  {
    id: "period-selector",
    target: '[data-tour-id="period-selector"]',
    title: "Time Period",
    description:
      "Switch between today, this week, this month, or this year to see how your revenue changes over different windows.",
    placement: "bottom",
  },
  {
    id: "revenue",
    target: '[data-tour-id="revenue-cards"]',
    title: "Revenue Overview",
    description:
      "Track revenue, transaction count, upsale performance, and average order value at a glance. These update in real time as sessions complete.",
    placement: "bottom",
  },
  {
    id: "hardware",
    target: '[data-tour-id="hardware-status"]',
    title: "Hardware Status",
    description:
      "Green means healthy, red means offline. Monitor cameras, printers, and payment devices across your fleet. Issues here directly impact revenue.",
    placement: "top",
  },
  {
    id: "alerts",
    target: '[data-tour-id="recent-alerts"]',
    title: "Recent Alerts",
    description:
      "Critical alerts from your booths surface here. Tap \"View all\" to see the full history and filter by severity.",
    placement: "top",
  },
  {
    id: "complete",
    target: null,
    title: "You're All Set!",
    description:
      "That's the tour! You can restart it anytime from the help button (?) in the header. Now go manage your booths.",
    placement: "center",
  },
];

export const TOUR_STORAGE_KEYS = {
  completed: "boothiq_tour_completed",
  currentStep: "boothiq_tour_step",
  bannerDismissed: "boothiq_welcome_banner_dismissed",
} as const;
