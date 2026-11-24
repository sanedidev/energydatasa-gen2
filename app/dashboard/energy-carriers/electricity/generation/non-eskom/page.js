import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Generation — Non-Eskom" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Non-Eskom Generation", subtitle: "Municipal utilities and industrial co-generation" },
    "**Municipal electricity generation** exists in a handful of South African metros that historically built their own generation capacity alongside Eskom's national fleet, most notably the **City of Cape Town** and the **City of Tshwane**, both of which operate legacy municipal power stations still used for peaking or emergency supply. Most municipalities, however, are pure distributors — they buy bulk electricity from Eskom and resell it to end customers rather than generating their own.\n\n**Industrial self-generation and co-generation** is a growing category, where large industrial energy users install on-site generation — often combined heat and power (CHP) using waste heat from an industrial process, or increasingly solar PV — both to reduce grid dependence and, in some cases, to sell surplus power. Sasol's Secunda operations, for instance, include significant on-site co-generation capacity linked to its coal-to-liquids process.\n\nCollectively, non-Eskom generation remains a small share of national installed capacity compared to Eskom's fleet, but its relative importance grew sharply during the 2021-2023 load-shedding period, which pushed municipalities and large industrial users toward greater energy self-sufficiency. With load shedding not implemented since April/May 2025 and Eskom's coal fleet performance much improved, the regulatory reforms that made self-generation easier to build (see the Private Generation page) remain a permanent change, even as the crisis-era urgency behind new projects may ease.",
    { type: "title", title: "Sources & References" },
    "1. Eskom, [generation performance and diesel-usage updates (2026)](https://www.eskom.co.za/) - for current national grid-stability context (see the Eskom Oil / OCGT page on this site for linked sources).\n2. GreenCape, [Large-Scale Renewable Energy Market Intelligence Reports](https://greencape.co.za/market-intelligence/large-scale-renewable-energy/) - industry tracking of South African generation investment, including non-Eskom and embedded categories.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Non-Eskom" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Generation</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Non-Eskom Generation</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Municipal generators, industrial self-generators, and other non-Eskom electricity producers in South Africa.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.electricity.generation.non-eskom"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
