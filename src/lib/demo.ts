// =============================================================
// DEMO DATA — Sprint 1 frontend stub only.
//
// To remove when auth ships (Sprint 2):
//   1. Delete this file
//   2. src/app/dashboard/page.tsx     → fetch profile + services from real session
//   3. src/components/layout/header.tsx → replace DEMO_PRO with real session profile
//   4. src/app/dashboard/layout.tsx   → replace DEMO_PRO.id with real session profile ID
// =============================================================

export const DEMO_PRO = {
  id: "b2c3d4e5-0001-4000-8000-000000000002",
  fullName: "James Okonkwo",
  firstName: "James",
  email: "james.okonkwo@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  location: "Portland, OR",
  bio: "Furniture maker and woodworker specializing in mid-century modern designs. Every piece is handmade in my Portland workshop.",
} as const;

export interface DemoInquiry {
  id: string;
  clientName: string;
  clientInitial: string;
  serviceTitle: string;
  message: string;
  date: string;
  isNew: boolean;
}

export const DEMO_INQUIRIES: DemoInquiry[] = [
  {
    id: "inq-1",
    clientName: "Sarah Mitchell",
    clientInitial: "S",
    serviceTitle: "Custom Dining Table",
    message:
      "Hi James! I'm looking for a custom dining table for my new home. I'd love something in walnut, seats 6–8 people. Do you have availability in the next couple of months?",
    date: "2026-03-07",
    isNew: true,
  },
  {
    id: "inq-2",
    clientName: "Tom Keller",
    clientInitial: "T",
    serviceTitle: "Custom Furniture Commission",
    message:
      "We're opening a small café and need 6 matching stools for our counter. Looking for a mid-century style in oak or ash. What would your timeline and rough estimate be?",
    date: "2026-03-05",
    isNew: true,
  },
  {
    id: "inq-3",
    clientName: "Lisa Reyes",
    clientInitial: "L",
    serviceTitle: "Reclaimed Wood Shelving",
    message:
      "Do you do custom wall shelving? I have a specific alcove that needs floating shelves, roughly 8 ft wide. Would love reclaimed wood if you have it.",
    date: "2026-03-01",
    isNew: false,
  },
];
