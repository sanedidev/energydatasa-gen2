import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Generation — Non-Eskom" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Non-Eskom Generation", subtitle: "Municipal utilities and industrial co-generation" },
    "**Municipal electricity generation** exists in a handful of South African metros that historically built their own generation capacity alongside Eskom's national fleet, most notably the **City of Cape Town** and the **City of Tshwane**, both of which operate legacy municipal power stations still used for peaking or emergency supply. Most municipalities, however, are pure distributors — they buy bulk electricity from Eskom and resell it to end customers rather than generating their own.\n\n**Industrial self-generation and co-generation** is a growing category, where large industrial energy users install on-site generation — often combined heat and power (CHP) using waste heat from an industrial process, or increasingly solar PV — both to reduce grid dependence and, in some cases, to sell surplus power. Sasol's Secunda operations, for instance, include significant on-site co-generation capacity linked to its coal-to-liquids process.\n\nCollectively, non-Eskom generation remains a small share of national installed capacity compared to Eskom's fleet, but its relative importance has grown as load-shedding has pushed municipalities and large industrial users to pursue greater energy self-sufficiency, and as embedded generation registration frameworks have made it easier to formally track this capacity.",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Generation</p>
                <h1 className="text-2xl font-bold text-slate-900">Non-Eskom Generation</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Municipal generators, industrial self-generators, and other non-Eskom electricity producers in South Africa.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.electricity.generation.non-eskom"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
