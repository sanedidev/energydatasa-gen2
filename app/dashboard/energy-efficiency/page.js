import { redirect } from "next/navigation";

// Energy Efficiency's own index merged into Energy Efficiency & Planning -
// this route stays so old bookmarks/links keep working. The 4 leaf pages
// under this folder (tax-incentives, etc.) are untouched and still live here.
export default function Page() {
    redirect("/dashboard/energy-efficiency-planning");
}
