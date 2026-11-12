import { SolarIcon, LiveReadingIcon, BatteryIcon, LeafIcon, RippleIcon } from "@/app/components/ui/icons/AnimatedIcons";

// A choice of one of the site's own animated line icons, stored as plain
// text in the same string fields that already hold a MediaLibrary Storage
// path (AudienceProfile.logo, InsightArticle.imageKey, ImageBlock.key) -
// no schema or Lambda change needed. The "icon:" prefix can never collide
// with a real Storage path (those are always "insights/...").
const ICON_REF_PREFIX = "icon:";

export const ICON_REGISTRY = [
    { id: "solar",       label: "Solar",        Icon: SolarIcon },
    { id: "liveReading", label: "Live Reading", Icon: LiveReadingIcon },
    { id: "battery",     label: "Battery",      Icon: BatteryIcon },
    { id: "leaf",        label: "Leaf",         Icon: LeafIcon },
    { id: "ripple",      label: "Ripple",       Icon: RippleIcon },
];

const ICON_BY_ID = Object.fromEntries(ICON_REGISTRY.map((entry) => [entry.id, entry]));

export function iconRefFor(id) {
    return `${ICON_REF_PREFIX}${id}`;
}

// Returns the icon id if `value` is a valid icon reference, else null.
export function parseIconRef(value) {
    if (typeof value !== "string" || !value.startsWith(ICON_REF_PREFIX)) return null;
    const id = value.slice(ICON_REF_PREFIX.length);
    return ICON_BY_ID[id] ? id : null;
}

export function getIconEntry(id) {
    return ICON_BY_ID[id] ?? null;
}
