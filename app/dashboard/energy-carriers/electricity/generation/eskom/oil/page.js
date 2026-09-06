import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom — Oil Generation" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Oil", subtitle: "Eskom's diesel-fired open-cycle gas turbines" },
    "Eskom's oil-fired generation consists of **open-cycle gas turbines (OCGTs)** — most notably at **Ankerlig** (near Atlantis, Western Cape) and **Gourikwa** (near Mossel Bay) — designed to run on diesel and used specifically as **peaking and emergency capacity** rather than for regular baseload supply. OCGTs can start up and reach full output within minutes, making them one of the fastest-responding assets in the fleet, but diesel is by far Eskom's most expensive fuel per unit of electricity generated.\n\nAs a result, OCGT dispatch is generally reserved for periods of severe supply constraint — precisely the conditions associated with load-shedding — meaning their utilisation and associated diesel spend have varied enormously from year to year depending on the reliability of the coal fleet and overall system margin. Heavy OCGT reliance during periods of coal fleet underperformance has been a recurring and significant driver of Eskom's primary energy costs.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Oil" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Eskom Generation</p>
                <h1 className="text-2xl font-bold text-slate-900">Oil</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Eskom&apos;s oil-fired generation units — capacity, fuel usage, operational role, and technology context.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.oil"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
