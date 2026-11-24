// Shared static navigation tree for the merged Energy Efficiency & Planning
// section. BASE is this section's own root - used only for any NEW content
// created from here going forward (CarrierPicker/CarrierIndexPage). The 8
// pre-existing leaf pages below keep their real, original hrefs under
// /dashboard/energy-efficiency/... and /dashboard/energy-planning/... -
// those routes were not moved, only the dashboard presentation merged.
// Imported by _section-nav.js and CarrierPicker.js.

import { STATIC_NAV as EE_NAV } from "@/app/dashboard/energy-efficiency/_nav-data";
import { STATIC_NAV as EP_NAV } from "@/app/dashboard/energy-planning/_nav-data";

export const BASE = "/dashboard/energy-efficiency-planning";

export const STATIC_NAV = [...EE_NAV, ...EP_NAV];
