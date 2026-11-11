import { NEBDataProvider } from "@/app/context/NEBData";

export default function EnergyBalanceLayout({ children }) {
    return <NEBDataProvider>{children}</NEBDataProvider>;
}
