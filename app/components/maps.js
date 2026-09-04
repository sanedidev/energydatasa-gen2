"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import Breadcrumbs from "./breadcrumbs";
import { apiClient as client } from "@/app/lib/apiClient";
import { usePermissions } from "@/app/context/permissions";
import ConfirmDialog from "./ui/ConfirmDialog";

const MAP_SLUG = "maps.power-stations";

// ── Colours & styles ──────────────────────────────────────────────────────────

const TYPE_STYLE = {
    "Coal":          { fill: "#94a3b8", pill: "bg-slate-100 text-slate-700 border-slate-200" },
    "Wind":          { fill: "#34d399", pill: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    "Solar PV":      { fill: "#fbbf24", pill: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    "Solar CSP":     { fill: "#f97316", pill: "bg-orange-100 text-orange-800 border-orange-200" },
    "Nuclear":       { fill: "#a78bfa", pill: "bg-violet-100 text-violet-800 border-violet-200" },
    "Hydroelectric": { fill: "#38bdf8", pill: "bg-sky-100 text-sky-800 border-sky-200" },
    "OCGT":          { fill: "#f87171", pill: "bg-red-100 text-red-800 border-red-200" },
    "Biomass":       { fill: "#86efac", pill: "bg-green-100 text-green-800 border-green-200" },
    "Landfill Gas":  { fill: "#e879f9", pill: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200" },
};

const ENERGY_TYPES = Object.keys(TYPE_STYLE);

const COLOR_EXPR = [
    "match", ["get", "type"],
    ...Object.entries(TYPE_STYLE).flatMap(([k, v]) => [k, v.fill]),
    "#ffffff",
];

// ── Default data ──────────────────────────────────────────────────────────────

const DEFAULT_STATIONS = [
    { name: "Arnot Power Station",                    type: "Coal",          province: "Mpumalanga",    lat: -26.0483, lng: 29.9719, capacity_mw: 2352, operator: "Eskom",                             commissioned: 1975, notes: "Dry cooled; 6 × 392 MW units",                            hidden: false },
    { name: "Camden Power Station",                   type: "Coal",          province: "Mpumalanga",    lat: -27.0503, lng: 30.0697, capacity_mw: 1520, operator: "Eskom",                             commissioned: 1967, notes: "Recommissioned 2005–2008",                              hidden: false },
    { name: "Duvha Power Station",                    type: "Coal",          province: "Mpumalanga",    lat: -26.0564, lng: 29.2236, capacity_mw: 3600, operator: "Eskom",                             commissioned: 1980, notes: "6 × 600 MW units",                                    hidden: false },
    { name: "Grootvlei Power Station",                type: "Coal",          province: "Mpumalanga",    lat: -26.8342, lng: 28.6581, capacity_mw: 1200, operator: "Eskom",                             commissioned: 1969, notes: "Recommissioned 2008–2011",                              hidden: false },
    { name: "Hendrina Power Station",                 type: "Coal",          province: "Mpumalanga",    lat: -26.1489, lng: 29.7167, capacity_mw: 2000, operator: "Eskom",                             commissioned: 1970, notes: "Recommissioned 2009–2013",                              hidden: false },
    { name: "Kendal Power Station",                   type: "Coal",          province: "Mpumalanga",    lat: -26.0761, lng: 29.1406, capacity_mw: 4116, operator: "Eskom",                             commissioned: 1988, notes: "World's largest dry-cooled coal station",             hidden: false },
    { name: "Kriel Power Station",                    type: "Coal",          province: "Mpumalanga",    lat: -26.2792, lng: 29.2653, capacity_mw: 3000, operator: "Eskom",                             commissioned: 1976, notes: "6 × 500 MW units",                                    hidden: false },
    { name: "Kusile Power Station",                   type: "Coal",          province: "Mpumalanga",    lat: -26.1544, lng: 29.0786, capacity_mw: 4800, operator: "Eskom",                             commissioned: 2017, notes: "6 × 800 MW units; partially operational",           hidden: false },
    { name: "Lethabo Power Station",                  type: "Coal",          province: "Free State",    lat: -26.8553, lng: 27.8856, capacity_mw: 3708, operator: "Eskom",                             commissioned: 1985, notes: "Wet cooled; 6 × 618 MW units",                        hidden: false },
    { name: "Majuba Power Station",                   type: "Coal",          province: "Mpumalanga",    lat: -27.0997, lng: 29.7856, capacity_mw: 4110, operator: "Eskom",                             commissioned: 1996, notes: "6 × 685 MW units",                                    hidden: false },
    { name: "Matimba Power Station",                  type: "Coal",          province: "Limpopo",       lat: -23.6833, lng: 27.6667, capacity_mw: 3990, operator: "Eskom",                             commissioned: 1987, notes: "Dry cooled; 6 × 665 MW units",                        hidden: false },
    { name: "Matla Power Station",                    type: "Coal",          province: "Mpumalanga",    lat: -26.3528, lng: 29.3722, capacity_mw: 3600, operator: "Eskom",                             commissioned: 1979, notes: "6 × 600 MW units",                                    hidden: false },
    { name: "Medupi Power Station",                   type: "Coal",          province: "Limpopo",       lat: -23.6769, lng: 27.5603, capacity_mw: 4764, operator: "Eskom",                             commissioned: 2015, notes: "Dry cooled; 6 × 794 MW units",                        hidden: false },
    { name: "Tutuka Power Station",                   type: "Coal",          province: "Mpumalanga",    lat: -26.7658, lng: 29.3497, capacity_mw: 3654, operator: "Eskom",                             commissioned: 1985, notes: "6 × 609 MW units",                                    hidden: false },
    { name: "Kelvin Power Station",                   type: "Coal",          province: "Gauteng",       lat: -26.1167, lng: 28.1167, capacity_mw:  600, operator: "Kelvin Power (Pty) Ltd",            commissioned: 1954, notes: "Johannesburg",                                        hidden: false },
    { name: "Acacia Power Station",                   type: "OCGT",          province: "Western Cape",  lat: -33.8667, lng: 18.5333, capacity_mw:  171, operator: "Eskom",                             commissioned: 1976, notes: "3 × 57 MW gas turbines; Cape Town",                  hidden: false },
    { name: "Port Rex Power Station",                 type: "OCGT",          province: "Eastern Cape",  lat: -32.9833, lng: 27.9167, capacity_mw:  171, operator: "Eskom",                             commissioned: 1976, notes: "3 × 57 MW gas turbines; East London",                hidden: false },
    { name: "Newcastle Gas Turbine Station",          type: "OCGT",          province: "KwaZulu-Natal", lat: -27.7500, lng: 29.9667, capacity_mw:  147, operator: "Eskom",                             commissioned: 1978, notes: "5 × 29.4 MW units",                                   hidden: false },
    { name: "Avon Peaking Power Plant",               type: "OCGT",          province: "KwaZulu-Natal", lat: -29.5006, lng: 31.0064, capacity_mw:  685, operator: "Engie",                             commissioned: 2016, notes: "Near Tongaat; IPP",                                   hidden: false },
    { name: "Dedisa Peaking Power Plant",             type: "OCGT",          province: "Eastern Cape",  lat: -33.8017, lng: 25.5333, capacity_mw:  342, operator: "Engie",                             commissioned: 2015, notes: "Coega IDZ, Port Elizabeth; IPP",                     hidden: false },
    { name: "Koeberg Nuclear Power Station",          type: "Nuclear",       province: "Western Cape",  lat: -33.6667, lng: 18.4333, capacity_mw: 1860, operator: "Eskom",                             commissioned: 1984, notes: "Africa's only nuclear power station; 2 × 930 MW units", hidden: false },
    { name: "Drakensberg Pumped Storage",             type: "Hydroelectric", province: "KwaZulu-Natal", lat: -28.9833, lng: 29.1667, capacity_mw: 1000, operator: "Eskom",                             commissioned: 1981, notes: "Pumped storage scheme",                                  hidden: false },
    { name: "Ingula Pumped Storage Scheme",           type: "Hydroelectric", province: "KwaZulu-Natal", lat: -28.4167, lng: 29.6167, capacity_mw: 1332, operator: "Eskom",                             commissioned: 2016, notes: "Pumped storage; border KZN/Free State",                hidden: false },
    { name: "Gariep Dam Power Station",               type: "Hydroelectric", province: "Free State",    lat: -30.5500, lng: 25.5167, capacity_mw:  360, operator: "Eskom",                             commissioned: 1971, notes: "On Orange River",                                     hidden: false },
    { name: "Vanderkloof Dam Power Station",          type: "Hydroelectric", province: "Northern Cape", lat: -29.9833, lng: 24.7333, capacity_mw:  240, operator: "Eskom",                             commissioned: 1977, notes: "On Orange River",                                     hidden: false },
    { name: "First Falls Power Station",              type: "Hydroelectric", province: "KwaZulu-Natal", lat: -29.4833, lng: 30.7500, capacity_mw:   20, operator: "Eskom",                             commissioned: 1925, notes: "On Umgeni River",                                     hidden: false },
    { name: "Second Falls Power Station",             type: "Hydroelectric", province: "KwaZulu-Natal", lat: -29.5000, lng: 30.7667, capacity_mw:   11, operator: "Eskom",                             commissioned: 1926, notes: "On Umgeni River",                                     hidden: false },
    { name: "Ncora Power Station",                    type: "Hydroelectric", province: "Eastern Cape",  lat: -31.8333, lng: 28.1833, capacity_mw:    2, operator: "Eastern Cape",                      commissioned: 1976, notes: "Small run-of-river",                                  hidden: false },
    { name: "Colley Wobbles Power Station",           type: "Hydroelectric", province: "Eastern Cape",  lat: -32.1833, lng: 28.4167, capacity_mw:   42, operator: "Eskom",                             commissioned: 1979, notes: "On Mbashe River",                                     hidden: false },
    { name: "Second Gorge Power Station",             type: "Hydroelectric", province: "Eastern Cape",  lat: -32.2167, lng: 28.3833, capacity_mw:   15, operator: "Eskom",                             commissioned: 1980, notes: "On Mbashe River",                                     hidden: false },
    { name: "Stortemelk Hydroelectric",               type: "Hydroelectric", province: "Free State",    lat: -28.7500, lng: 28.9000, capacity_mw:    4, operator: "Stortemelk Hydro",                  commissioned: 2015, notes: "Small hydro; run-of-river",                          hidden: false },
    { name: "Amakhala Emoyeni Wind Farm",             type: "Wind",          province: "Eastern Cape",  lat: -33.0833, lng: 26.3333, capacity_mw:  134, operator: "RPower",                            commissioned: 2014, notes: "Near Bedford",                                        hidden: false },
    { name: "Cookhouse Wind Farm",                    type: "Wind",          province: "Eastern Cape",  lat: -32.7444, lng: 25.8333, capacity_mw:  138, operator: "African Clean Energy Developments",  commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Darling Wind Farm",                      type: "Wind",          province: "Western Cape",  lat: -33.3833, lng: 18.3667, capacity_mw:    5, operator: "Darling Independent Power",         commissioned: 2008, notes: "South Africa's first commercial wind farm",       hidden: false },
    { name: "Dorper Wind Farm",                       type: "Wind",          province: "Eastern Cape",  lat: -31.5500, lng: 25.6667, capacity_mw:   97, operator: "BioTherm Energy",                   commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Dassiesklip Wind Energy",                type: "Wind",          province: "Western Cape",  lat: -34.3833, lng: 19.5167, capacity_mw:   27, operator: "Mainstream Renewable Power",        commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "De Aar Wind Farm 1",                     type: "Wind",          province: "Northern Cape", lat: -30.6667, lng: 24.0000, capacity_mw:   96, operator: "Mainstream Renewable Power",        commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "De Aar Wind Farm 2",                     type: "Wind",          province: "Northern Cape", lat: -30.7000, lng: 24.0167, capacity_mw:  139, operator: "Mainstream Renewable Power",        commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "Gouda Wind Farm",                        type: "Wind",          province: "Western Cape",  lat: -33.3667, lng: 19.0000, capacity_mw:  138, operator: "Mainstream Renewable Power",        commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Grassridge Wind Energy",                 type: "Wind",          province: "Eastern Cape",  lat: -33.4167, lng: 25.8500, capacity_mw:   59, operator: "BioTherm Energy",                   commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Hopefield Wind Farm",                    type: "Wind",          province: "Western Cape",  lat: -33.0667, lng: 18.3500, capacity_mw:   65, operator: "Globeleq",                          commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Jeffreys Bay Wind Farm",                 type: "Wind",          province: "Eastern Cape",  lat: -34.0500, lng: 24.9167, capacity_mw:  138, operator: "Globeleq",                          commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Karoshoek Wind Energy",                  type: "Wind",          province: "Northern Cape", lat: -28.9167, lng: 21.8333, capacity_mw:  140, operator: "Enel Green Power",                  commissioned: 2022, notes: "",                                                    hidden: false },
    { name: "Klipheuwel Wind Farm",                   type: "Wind",          province: "Western Cape",  lat: -33.7500, lng: 18.7167, capacity_mw:    3, operator: "Eskom",                             commissioned: 2002, notes: "Demonstration project",                              hidden: false },
    { name: "Loeriesfontein 2 Wind Farm",             type: "Wind",          province: "Northern Cape", lat: -30.9833, lng: 19.4333, capacity_mw:  140, operator: "Mulilo Renewable Energy",           commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "Longyuan Mulilo De Aar Maanhaarberg",    type: "Wind",          province: "Northern Cape", lat: -30.6667, lng: 24.1167, capacity_mw:   96, operator: "Longyuan Mulilo",                   commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "Longyuan Mulilo De Aar 2 North",         type: "Wind",          province: "Northern Cape", lat: -30.6500, lng: 24.0333, capacity_mw:  139, operator: "Longyuan Mulilo",                   commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "Nobelsfontein Wind Energy",              type: "Wind",          province: "Northern Cape", lat: -31.4167, lng: 20.6000, capacity_mw:   73, operator: "Building Energy",                   commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Nojoli Wind Farm",                       type: "Wind",          province: "Eastern Cape",  lat: -33.2167, lng: 26.3833, capacity_mw:   88, operator: "Globeleq",                          commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Perdekraal East Wind Farm",              type: "Wind",          province: "Western Cape",  lat: -33.6667, lng: 19.3000, capacity_mw:  110, operator: "Mainstream Renewable Power",        commissioned: 2021, notes: "",                                                    hidden: false },
    { name: "Roggeveld Wind Farm",                    type: "Wind",          province: "Western Cape",  lat: -33.3000, lng: 20.3000, capacity_mw:  147, operator: "G7 Renewable Energies",             commissioned: 2022, notes: "",                                                    hidden: false },
    { name: "Sere Wind Farm",                         type: "Wind",          province: "Western Cape",  lat: -31.9500, lng: 18.3833, capacity_mw:  100, operator: "Eskom",                             commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Soetwater Wind Energy",                  type: "Wind",          province: "Western Cape",  lat: -34.4167, lng: 19.4333, capacity_mw:  138, operator: "Enel Green Power",                  commissioned: 2022, notes: "",                                                    hidden: false },
    { name: "Tsitsikamma Community Wind Farm",        type: "Wind",          province: "Eastern Cape",  lat: -34.0167, lng: 24.1667, capacity_mw:   96, operator: "Cennergi",                          commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Van Stadens Wind Farm",                  type: "Wind",          province: "Eastern Cape",  lat: -33.8833, lng: 25.3833, capacity_mw:    3, operator: "Innowind",                          commissioned: 2015, notes: "Small demonstration project",                        hidden: false },
    { name: "Khobab Wind Farm",                       type: "Wind",          province: "Northern Cape", lat: -30.9667, lng: 19.4000, capacity_mw:  140, operator: "Mulilo Renewable Energy",           commissioned: 2017, notes: "",                                                    hidden: false },
    { name: "Roundhill Wind Farm",                    type: "Wind",          province: "Eastern Cape",  lat: -33.6333, lng: 26.8167, capacity_mw:   40, operator: "Mainstream Renewable Power",        commissioned: 2021, notes: "",                                                    hidden: false },
    { name: "Kalkbult Solar PV",                      type: "Solar PV",      province: "Northern Cape", lat: -30.2167, lng: 24.1833, capacity_mw:   75, operator: "Scatec Solar",                      commissioned: 2013, notes: "",                                                    hidden: false },
    { name: "Aries Solar PV",                         type: "Solar PV",      province: "Northern Cape", lat: -29.1500, lng: 19.9000, capacity_mw:   50, operator: "Globeleq",                          commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Konkoonsies Solar PV",                   type: "Solar PV",      province: "Northern Cape", lat: -28.7833, lng: 19.9333, capacity_mw:   75, operator: "BioTherm Energy",                   commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Greefspan Solar PV",                     type: "Solar PV",      province: "Northern Cape", lat: -29.7500, lng: 23.9167, capacity_mw:   10, operator: "PV Africa",                         commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Greefspan II Solar PV",                  type: "Solar PV",      province: "Northern Cape", lat: -29.7500, lng: 23.9333, capacity_mw:   75, operator: "PV Africa",                         commissioned: 2021, notes: "",                                                    hidden: false },
    { name: "Mulilo Prieska Solar PV",                type: "Solar PV",      province: "Northern Cape", lat: -29.5333, lng: 22.6500, capacity_mw:   75, operator: "Mulilo Renewable Energy",           commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Mulilo Sonnedix Prieska Solar",          type: "Solar PV",      province: "Northern Cape", lat: -29.5500, lng: 22.6333, capacity_mw:   86, operator: "Mulilo Sonnedix",                   commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Soutpan Solar Park",                     type: "Solar PV",      province: "Free State",    lat: -29.1000, lng: 26.3333, capacity_mw:   28, operator: "Erika Energy",                      commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Witkop Solar Park",                      type: "Solar PV",      province: "Limpopo",       lat: -23.8500, lng: 28.8500, capacity_mw:   20, operator: "Core Energy",                       commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "RustMo1 Solar Farm",                     type: "Solar PV",      province: "North West",    lat: -25.7167, lng: 27.2000, capacity_mw:    7, operator: "RustMo",                            commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Letsatsi Solar PV",                      type: "Solar PV",      province: "Free State",    lat: -28.9667, lng: 26.7833, capacity_mw:   64, operator: "SolarReserve",                      commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Lesedi Solar PV",                        type: "Solar PV",      province: "Free State",    lat: -28.9500, lng: 26.8000, capacity_mw:   64, operator: "SolarReserve",                      commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Jasper Solar PV",                        type: "Solar PV",      province: "Northern Cape", lat: -28.9167, lng: 22.5833, capacity_mw:   96, operator: "SolarReserve",                      commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Kathu Solar Park",                       type: "Solar PV",      province: "Northern Cape", lat: -27.6833, lng: 23.0500, capacity_mw:   75, operator: "Building Energy",                   commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Sishen Solar Facility",                  type: "Solar PV",      province: "Northern Cape", lat: -27.8167, lng: 23.0167, capacity_mw:   74, operator: "Acciona",                           commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "De Aar Solar PV 1",                      type: "Solar PV",      province: "Northern Cape", lat: -30.6333, lng: 24.0333, capacity_mw:   75, operator: "Solar Capital",                     commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "De Aar Solar PV 2",                      type: "Solar PV",      province: "Northern Cape", lat: -30.6500, lng: 24.0500, capacity_mw:   75, operator: "Solar Capital",                     commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "De Aar Solar PV 3",                      type: "Solar PV",      province: "Northern Cape", lat: -30.6667, lng: 24.0667, capacity_mw:   75, operator: "Solar Capital",                     commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Droogfontein Solar PV",                  type: "Solar PV",      province: "Northern Cape", lat: -29.2000, lng: 23.6500, capacity_mw:   50, operator: "Globeleq",                          commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Droogfontein 2 Solar PV",                type: "Solar PV",      province: "Northern Cape", lat: -29.1833, lng: 23.6333, capacity_mw:   75, operator: "Globeleq",                          commissioned: 2020, notes: "",                                                    hidden: false },
    { name: "Linde Solar PV",                         type: "Solar PV",      province: "Eastern Cape",  lat: -32.9167, lng: 27.1167, capacity_mw:   40, operator: "Scatec Solar",                      commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Dreunberg Solar PV",                     type: "Solar PV",      province: "Eastern Cape",  lat: -31.5667, lng: 25.8000, capacity_mw:   75, operator: "Scatec Solar",                      commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Touwsrivier Solar Energy",               type: "Solar PV",      province: "Western Cape",  lat: -33.6667, lng: 19.7500, capacity_mw:   36, operator: "Soitec",                            commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "SlimSun Swartland Solar Park",           type: "Solar PV",      province: "Western Cape",  lat: -33.3333, lng: 18.7000, capacity_mw:    5, operator: "SlimSun",                           commissioned: 2013, notes: "",                                                    hidden: false },
    { name: "Vredendal Solar Power Park",             type: "Solar PV",      province: "Western Cape",  lat: -31.6667, lng: 18.5000, capacity_mw:   10, operator: "Suntech",                           commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Rietvlei Solar Power",                   type: "Solar PV",      province: "Western Cape",  lat: -33.6167, lng: 18.9000, capacity_mw:    9, operator: "Aurora",                            commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "Paleisheuwel Solar Park",                type: "Solar PV",      province: "Western Cape",  lat: -32.8500, lng: 18.5167, capacity_mw:   82, operator: "TerniEnergia",                      commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Pulida Solar Park",                      type: "Solar PV",      province: "Free State",    lat: -28.7333, lng: 24.8667, capacity_mw:   75, operator: "Pulida Energy",                     commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Adams Solar PV",                         type: "Solar PV",      province: "Northern Cape", lat: -28.9500, lng: 22.5500, capacity_mw:   40, operator: "Adams Solar",                       commissioned: 2015, notes: "",                                                    hidden: false },
    { name: "Tom Burke Solar Park",                   type: "Solar PV",      province: "Limpopo",       lat: -22.6667, lng: 28.0000, capacity_mw:   60, operator: "Tobivox",                           commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Boshof Solar Park",                      type: "Solar PV",      province: "Free State",    lat: -28.5500, lng: 25.2500, capacity_mw:   10, operator: "BSP",                               commissioned: 2014, notes: "",                                                    hidden: false },
    { name: "De Wildt Solar PV",                      type: "Solar PV",      province: "North West",    lat: -25.6500, lng: 27.4167, capacity_mw:   50, operator: "SunEdison/Atamya",                  commissioned: 2021, notes: "",                                                    hidden: false },
    { name: "Kenhardt Solar PV 1",                    type: "Solar PV",      province: "Northern Cape", lat: -29.3667, lng: 21.1333, capacity_mw:  255, operator: "Scatec",                            commissioned: 2024, notes: "With battery storage",                               hidden: false },
    { name: "Kenhardt Solar PV 2",                    type: "Solar PV",      province: "Northern Cape", lat: -29.3833, lng: 21.1500, capacity_mw:  255, operator: "Scatec",                            commissioned: 2024, notes: "With battery storage",                               hidden: false },
    { name: "Kenhardt Solar PV 3",                    type: "Solar PV",      province: "Northern Cape", lat: -29.4000, lng: 21.1667, capacity_mw:  255, operator: "Scatec",                            commissioned: 2024, notes: "With battery storage",                               hidden: false },
    { name: "Kathu Solar Park CSP",                   type: "Solar CSP",     province: "Northern Cape", lat: -27.6833, lng: 23.0833, capacity_mw:  100, operator: "SolarReserve / Saudi Aramco",       commissioned: 2019, notes: "Parabolic trough; 4.5 h storage",                 hidden: false },
    { name: "Bokpoort CSP",                           type: "Solar CSP",     province: "Northern Cape", lat: -28.7500, lng: 21.9833, capacity_mw:   50, operator: "ACWA Power",                        commissioned: 2016, notes: "Parabolic trough; 9.3 h storage",                 hidden: false },
    { name: "KaXu Solar One CSP",                     type: "Solar CSP",     province: "Northern Cape", lat: -28.7167, lng: 20.1500, capacity_mw:  100, operator: "Abengoa",                           commissioned: 2015, notes: "Parabolic trough",                                    hidden: false },
    { name: "Xina Solar One CSP",                     type: "Solar CSP",     province: "Northern Cape", lat: -28.9333, lng: 20.2167, capacity_mw:  100, operator: "Abengoa",                           commissioned: 2017, notes: "Parabolic trough; 5.5 h storage",                 hidden: false },
    { name: "Illanga CSP 1",                          type: "Solar CSP",     province: "Northern Cape", lat: -28.7500, lng: 21.9667, capacity_mw:  100, operator: "ACWA Power",                        commissioned: 2020, notes: "",                                                    hidden: false },
    { name: "Ilanga 1 CSP",                           type: "Solar CSP",     province: "Northern Cape", lat: -28.7167, lng: 21.9500, capacity_mw:  100, operator: "ACWA Power",                        commissioned: 2019, notes: "",                                                    hidden: false },
    { name: "GDF Suez Nojoli Biomass",                type: "Biomass",       province: "Eastern Cape",  lat: -33.2333, lng: 26.4000, capacity_mw:   25, operator: "Nojoli Biomass",                    commissioned: 2015, notes: "Bagasse biomass",                                     hidden: false },
    { name: "Sappi Ngodwana Biomass",                 type: "Biomass",       province: "Mpumalanga",    lat: -25.0833, lng: 30.6667, capacity_mw:   25, operator: "Sappi",                             commissioned: 2014, notes: "Biomass from paper mill",                            hidden: false },
    { name: "Abellon Clean Energy Biomass",           type: "Biomass",       province: "KwaZulu-Natal", lat: -29.6167, lng: 31.0167, capacity_mw:   21, operator: "Abellon",                           commissioned: 2016, notes: "",                                                    hidden: false },
    { name: "Joburg Landfill Gas Marie Louise",       type: "Landfill Gas",  province: "Gauteng",       lat: -26.2500, lng: 27.9333, capacity_mw:    6, operator: "City of Johannesburg",              commissioned: 2012, notes: "Methane from landfill",                              hidden: false },
    { name: "Joburg Landfill Gas Robinson Deep",      type: "Landfill Gas",  province: "Gauteng",       lat: -26.2333, lng: 28.0000, capacity_mw:    6, operator: "City of Johannesburg",              commissioned: 2013, notes: "Methane from landfill",                              hidden: false },
    { name: "Joburg Landfill Gas Goudkoppies",        type: "Landfill Gas",  province: "Gauteng",       lat: -26.3167, lng: 27.9167, capacity_mw:    4, operator: "City of Johannesburg",              commissioned: 2014, notes: "Methane from landfill",                              hidden: false },
    { name: "Vissershok Landfill Gas",                type: "Landfill Gas",  province: "Western Cape",  lat: -33.8167, lng: 18.5833, capacity_mw:    4, operator: "EnviroServ",                        commissioned: 2013, notes: "Near Cape Town",                                      hidden: false },
];

const ALL_PROVINCES = [...new Set(DEFAULT_STATIONS.map(s => s.province))].sort();

// ── Geojson builder ───────────────────────────────────────────────────────────

function buildGeojson(list, showHidden = false) {
    return {
        type: "FeatureCollection",
        features: list
            .filter(s => showHidden || !s.hidden)
            .map(s => ({
                type: "Feature",
                geometry:   { type: "Point", coordinates: [s.lng, s.lat] },
                properties: { ...s, hidden_num: s.hidden ? 1 : 0 },
            })),
    };
}

function emptyStation() {
    return { name: "", type: "Solar PV", province: "", lat: "", lng: "", capacity_mw: "", operator: "", commissioned: "", notes: "", hidden: false };
}

// ── Edit table rows ───────────────────────────────────────────────────────────

function StationRow({ station, idx, onEdit, onToggleHide, onDelete }) {
    const ts = TYPE_STYLE[station.type] ?? TYPE_STYLE["Coal"];
    return (
        <tr className={`border-b border-slate-100 text-xs ${station.hidden ? "opacity-40" : ""}`}>
            <td className="py-2 px-3 font-medium text-slate-800 max-w-48 truncate">{station.name}</td>
            <td className="py-2 px-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${ts.pill}`}>
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: ts.fill }} />
                    {station.type}
                </span>
            </td>
            <td className="py-2 px-3 text-slate-500">{station.province}</td>
            <td className="py-2 px-3 text-slate-600 text-right tabular-nums">{Number(station.capacity_mw).toLocaleString()}</td>
            <td className="py-2 px-3 text-slate-500 max-w-40 truncate">{station.operator}</td>
            <td className="py-2 px-3 text-slate-500 tabular-nums">{station.commissioned}</td>
            <td className="py-2 px-3">
                {station.hidden && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">Hidden</span>}
            </td>
            <td className="py-2 px-3">
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(idx)} className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">Edit</button>
                    <button onClick={() => onToggleHide(idx)} className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">{station.hidden ? "Show" : "Hide"}</button>
                    <button onClick={() => onDelete(idx)} className="rounded px-2 py-1 text-[11px] text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">Delete</button>
                </div>
            </td>
        </tr>
    );
}

function EditRow({ draft, onChange, onSave, onCancel }) {
    function f(k) { return (e) => onChange(k, e.target.value); }
    const valid = draft.name.trim() && draft.lat !== "" && draft.lng !== "" && draft.capacity_mw !== "";
    return (
        <tr className="border-b border-green-100 bg-green-50/30 text-xs">
            <td className="py-1 px-2"><input className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.name} onChange={f("name")} placeholder="Name *" /></td>
            <td className="py-1 px-2">
                <select className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.type} onChange={f("type")}>
                    {ENERGY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
            </td>
            <td className="py-1 px-2"><input className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.province} onChange={f("province")} placeholder="Province" /></td>
            <td className="py-1 px-2"><input type="number" className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.capacity_mw} onChange={f("capacity_mw")} placeholder="MW *" /></td>
            <td className="py-1 px-2"><input className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.operator} onChange={f("operator")} placeholder="Operator" /></td>
            <td className="py-1 px-2"><input type="number" className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.commissioned} onChange={f("commissioned")} placeholder="Year" /></td>
            <td className="py-1 px-2 text-[10px] text-slate-400">
                <div className="flex flex-col gap-0.5">
                    <input type="number" step="0.0001" className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.lat} onChange={f("lat")} placeholder="Lat *" />
                    <input type="number" step="0.0001" className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-300" value={draft.lng} onChange={f("lng")} placeholder="Lng *" />
                </div>
            </td>
            <td className="py-1 px-2">
                <div className="flex items-center gap-1">
                    <button onClick={onSave} disabled={!valid} className="rounded px-2 py-1 text-[11px] bg-green-700 text-white hover:bg-green-800 disabled:opacity-40 transition-colors">Save</button>
                    <button onClick={onCancel} className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                </div>
            </td>
        </tr>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Maps() {
    const { isAdmin, canEdit } = usePermissions();
    const canManage = isAdmin || canEdit("maps.power-stations");

    const containerRef = useRef(null);
    const mapRef       = useRef(null);
    const [mapReady,   setMapReady]   = useState(false);

    // Data
    const [stations,    setStations]    = useState(null);
    const [record,      setRecord]      = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [saving,      setSaving]      = useState(false);

    // Sidebar / selection
    const [selected,    setSelected]    = useState(null); // station name
    const [search,      setSearch]      = useState("");
    const [province,    setProvince]    = useState("All");
    const [typeFilter,  setTypeFilter]  = useState("All");

    // Edit mode
    const [editMode,         setEditMode]         = useState(false);
    const [tableSearch,      setTableSearch]       = useState("");
    const [editingIdx,       setEditingIdx]        = useState(null);
    const [editDraft,        setEditDraft]         = useState(null);
    const [addOpen,          setAddOpen]           = useState(false);
    const [newStation,       setNewStation]        = useState(emptyStation);
    const [confirmDeleteIdx, setConfirmDeleteIdx]  = useState(null);

    // ── Load from DB ──────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res  = await client.models.PageContent.pageContentBySlug({ slug: MAP_SLUG }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled) {
                    setRecord(item);
                    try {
                        const parsed = JSON.parse(item?.content ?? "null");
                        setStations(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_STATIONS);
                    } catch {
                        setStations(DEFAULT_STATIONS);
                    }
                }
            } catch {
                if (!cancelled) setStations(DEFAULT_STATIONS);
            } finally {
                if (!cancelled) setLoadingData(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // ── Persist to DB ─────────────────────────────────────────────────────────

    async function persist(updated) {
        setSaving(true);
        const content = JSON.stringify(updated);
        try {
            if (record) {
                const { data } = await client.models.PageContent.update({ id: record.id, content });
                setRecord(data);
            } else {
                const { data } = await client.models.PageContent.create({ slug: MAP_SLUG, content });
                setRecord(data);
            }
            setStations(updated);
        } finally {
            setSaving(false);
        }
    }

    // ── Init map ──────────────────────────────────────────────────────────────

    useEffect(() => {
        if (mapRef.current || !containerRef.current) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style:     "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
            center:    [24.5, -29.5],
            zoom: 5.2, minZoom: 4, maxZoom: 15,
            attributionControl: false,
        });
        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

        map.on("load", () => {
            map.addSource("stations", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

            // Glow halo
            map.addLayer({
                id: "stations-halo", type: "circle", source: "stations",
                paint: {
                    "circle-radius":  16,
                    "circle-color":   COLOR_EXPR,
                    "circle-opacity": ["case", ["==", ["get", "hidden_num"], 1], 0.04, 0.12],
                    "circle-blur":    1,
                },
            });

            // Core dot
            map.addLayer({
                id: "stations-core", type: "circle", source: "stations",
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["get", "capacity_mw"], 2, 5, 100, 8, 500, 12, 5000, 17],
                    "circle-color":          COLOR_EXPR,
                    "circle-opacity":        ["case", ["==", ["get", "hidden_num"], 1], 0.25, 0.88],
                    "circle-stroke-width":   1.5,
                    "circle-stroke-color":   "rgba(255,255,255,0.7)",
                    "circle-stroke-opacity": ["case", ["==", ["get", "hidden_num"], 1], 0.25, 1.0],
                },
            });

            // Selection ring
            map.addLayer({
                id: "stations-selected", type: "circle", source: "stations",
                filter: ["==", ["get", "name"], ""],
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["get", "capacity_mw"], 2, 10, 100, 14, 500, 18, 5000, 23],
                    "circle-color":          "transparent",
                    "circle-stroke-width":   2.5,
                    "circle-stroke-color":   "#ffffff",
                    "circle-opacity":        0,
                    "circle-stroke-opacity": 1,
                },
            });

            map.on("mouseenter", "stations-core", () => { map.getCanvas().style.cursor = "pointer"; });
            map.on("mouseleave", "stations-core", () => { map.getCanvas().style.cursor = ""; });
            map.on("click", "stations-core", (e) => {
                const name = e.features[0].properties.name;
                setSelected(prev => prev === name ? null : name);
            });

            setMapReady(true);
        });

        return () => { map.remove(); mapRef.current = null; };
    }, []);

    // ── Update map data when stations / editMode changes ──────────────────────

    useEffect(() => {
        if (!stations) return;
        function update() {
            const src = mapRef.current?.getSource?.("stations");
            if (!src) return;
            src.setData(buildGeojson(stations, editMode && canManage));
        }
        if (mapRef.current?.isStyleLoaded?.()) update();
        else if (mapRef.current) mapRef.current.once("load", update);
    }, [stations, editMode, canManage]);

    // ── Fly to selected + update highlight ring ───────────────────────────────

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady) return;
        if (selected) {
            const s = stations?.find(x => x.name === selected);
            if (s) map.flyTo({ center: [s.lng, s.lat], zoom: 10, duration: 1100, essential: true });
            map.setFilter("stations-selected", ["==", ["get", "name"], selected]);
        } else {
            map.setFilter("stations-selected", ["==", ["get", "name"], ""]);
        }
    }, [selected, mapReady, stations]);

    // ── Edit handlers ─────────────────────────────────────────────────────────

    function handleToggleHide(idx) {
        persist(stations.map((s, i) => i === idx ? { ...s, hidden: !s.hidden } : s));
    }

    function startEdit(idx) {
        setEditDraft({ ...stations[idx] });
        setEditingIdx(idx);
        setAddOpen(false);
    }

    function saveEdit() {
        const d = editDraft;
        persist(stations.map((s, i) => i === editingIdx ? {
            ...d, lat: parseFloat(d.lat), lng: parseFloat(d.lng),
            capacity_mw: Number(d.capacity_mw), commissioned: Number(d.commissioned),
        } : s));
        setEditingIdx(null);
        setEditDraft(null);
    }

    function handleDelete(idx) {
        persist(stations.filter((_, i) => i !== idx));
        setConfirmDeleteIdx(null);
        if (stations[idx]?.name === selected) setSelected(null);
    }

    function handleAdd() {
        const d = newStation;
        persist([...stations, {
            ...d, lat: parseFloat(d.lat), lng: parseFloat(d.lng),
            capacity_mw: Number(d.capacity_mw), commissioned: Number(d.commissioned),
        }]);
        setNewStation(emptyStation());
        setAddOpen(false);
    }

    function toggleEditMode() {
        setEditMode(v => {
            if (v) { setEditingIdx(null); setEditDraft(null); setAddOpen(false); setConfirmDeleteIdx(null); setTableSearch(""); }
            return !v;
        });
    }

    // ── Derived values ────────────────────────────────────────────────────────

    const visibleStations = stations ? stations.filter(s => !s.hidden) : [];
    const totalGW = visibleStations.length
        ? (visibleStations.reduce((a, s) => a + s.capacity_mw, 0) / 1000).toFixed(1)
        : "—";

    // Sidebar filtered list (applies to sidebar only, not map)
    const sidebarList = stations
        ? stations.filter(s => {
            if (editMode && canManage) return true; // show all including hidden in edit mode
            if (s.hidden) return false;
            if (province   !== "All" && s.province !== province)   return false;
            if (typeFilter !== "All" && s.type     !== typeFilter)  return false;
            if (search.trim()) {
                const q = search.toLowerCase();
                return s.name.toLowerCase().includes(q) || s.operator.toLowerCase().includes(q);
            }
            return true;
        })
        : [];

    // Edit table filtered list
    const tableFiltered = stations
        ? stations.filter(s => {
            if (!tableSearch.trim()) return true;
            const q = tableSearch.toLowerCase();
            return s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
                || s.province.toLowerCase().includes(q) || s.operator.toLowerCase().includes(q);
        })
        : [];

    const selectedStation = selected ? stations?.find(s => s.name === selected) : null;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <main className="min-h-screen bg-white">
            {confirmDeleteIdx !== null && (
                <ConfirmDialog
                    title={`Delete "${stations[confirmDeleteIdx]?.name}"?`}
                    message="This removes the station from the map and cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(confirmDeleteIdx)}
                    onCancel={() => setConfirmDeleteIdx(null)}
                />
            )}

            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Maps" }]} />

                {/* Header */}
                <div className="mt-6 mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Power Stations</p>
                        <h1 className="text-2xl font-bold text-slate-900">South Africa Power Station Map</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {loadingData
                                ? "Loading stations…"
                                : `${visibleStations.length} stations · ${totalGW} GW total installed capacity. Click any station or map marker to zoom in.`
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Type summary pills */}
                        {!loadingData && (
                            <div className="hidden lg:flex flex-wrap gap-1.5">
                                {ENERGY_TYPES.map(t => {
                                    const count = visibleStations.filter(s => s.type === t).length;
                                    if (!count) return null;
                                    return (
                                        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: TYPE_STYLE[t].fill }} />
                                            {t} <span className="text-slate-400">{count}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Edit map toggle — admins only */}
                        {canManage && !loadingData && (
                            <button
                                onClick={toggleEditMode}
                                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                                    editMode
                                        ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                            >
                                {editMode ? (
                                    <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Done editing</>
                                ) : (
                                    <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Edit map</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Edit mode banner */}
                {editMode && (
                    <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-700 font-medium">
                        Editing mode — hidden stations appear faded in the list. Changes save to the database immediately.
                        {saving && <span className="ml-2 opacity-60">Saving…</span>}
                    </div>
                )}

                {/* Filters */}
                {!editMode && (
                    <div className="mb-5 flex flex-wrap gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Search name or operator…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setSelected(null); }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <select
                            value={province}
                            onChange={e => { setProvince(e.target.value); setSelected(null); }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="All">All Provinces</option>
                            {ALL_PROVINCES.map(p => <option key={p}>{p}</option>)}
                        </select>
                        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => { setTypeFilter("All"); setSelected(null); }}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === "All" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                All types
                            </button>
                            {ENERGY_TYPES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setTypeFilter(t); setSelected(null); }}
                                    className={`px-3 py-1.5 text-xs font-medium border-l border-slate-200 transition-colors ${typeFilter === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-slate-400">{sidebarList.length} station{sidebarList.length !== 1 ? "s" : ""}</span>
                        {selected && (
                            <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2">
                                Clear selection
                            </button>
                        )}
                    </div>
                )}

                {/* Main grid: sidebar + map */}
                <div className="grid gap-5 lg:grid-cols-3">

                    {/* ── Station list (sidebar) ─────────────────────────────── */}
                    <div className="lg:col-span-1 space-y-2 overflow-y-auto max-h-145 pr-1">
                        {loadingData ? (
                            <div className="space-y-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                                ))}
                            </div>
                        ) : sidebarList.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">No stations match the current filters.</p>
                        ) : (
                            sidebarList.map((s) => {
                                const ts = TYPE_STYLE[s.type] ?? TYPE_STYLE["Coal"];
                                const isSelected = selected === s.name;
                                return (
                                    <button
                                        key={s.name}
                                        onClick={() => setSelected(s.name === selected ? null : s.name)}
                                        className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                                            s.hidden
                                                ? "opacity-40 border-slate-100 bg-white"
                                                : isSelected
                                                    ? "border-emerald-400 bg-emerald-50 shadow-sm"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="text-sm font-semibold text-slate-900 leading-snug">{s.name}</p>
                                            <span className={`shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5 border ${ts.pill}`}>{s.type}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                                            <span>{s.province}</span>
                                            <span className="font-semibold text-slate-700">{Number(s.capacity_mw).toLocaleString()} MW</span>
                                            <span className="text-slate-400">{s.commissioned}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* ── Map + detail panel ─────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Map */}
                        <div className="relative overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200" style={{ height: 520 }}>
                            <div ref={containerRef} className="h-full w-full" />

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2.5 backdrop-blur-md border border-slate-200 shadow-sm">
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Type</p>
                                {ENERGY_TYPES.map(t => (
                                    <div key={t} className="flex items-center gap-2 mb-1 last:mb-0">
                                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: TYPE_STYLE[t].fill }} />
                                        <span className="text-[11px] text-slate-600">{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail panel */}
                        {selectedStation ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="font-bold text-slate-900 text-lg leading-snug">{selectedStation.name}</h2>
                                        <p className="text-sm text-slate-500">{selectedStation.province} · Commissioned {selectedStation.commissioned}</p>
                                    </div>
                                    <span className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 border ${TYPE_STYLE[selectedStation.type]?.pill ?? ""}`}>
                                        {selectedStation.type}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                                        <p className="text-xs text-slate-500">Capacity</p>
                                        <p className="font-bold text-slate-900">{Number(selectedStation.capacity_mw).toLocaleString()} MW</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 col-span-2">
                                        <p className="text-xs text-slate-500">Operator</p>
                                        <p className="font-semibold text-slate-900 text-sm leading-snug">{selectedStation.operator}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                                        <p className="text-xs text-slate-500">Coordinates</p>
                                        <p className="font-mono text-xs font-semibold text-slate-700">{selectedStation.lat.toFixed(3)}, {selectedStation.lng.toFixed(3)}</p>
                                    </div>
                                </div>
                                {selectedStation.notes && (
                                    <p className="text-sm text-slate-600 leading-relaxed">{selectedStation.notes}</p>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
                                Click a station card or a map marker to see details
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-5 text-xs text-slate-400">
                    Data sourced from Eskom, NERSA, and REIPPP project registers. Dot size reflects installed capacity.
                </p>

                {/* ── Edit table (admins only, edit mode) ──────────────────── */}
                {canManage && editMode && stations && (
                    <div className="mt-10 space-y-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-base font-semibold text-slate-900">
                                Station data <span className="text-sm font-normal text-slate-400">({stations.length} total, {stations.filter(s => s.hidden).length} hidden)</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tableSearch}
                                    onChange={e => setTableSearch(e.target.value)}
                                    placeholder="Search name, type, province…"
                                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-200 w-56"
                                />
                                {!addOpen && (
                                    <button
                                        onClick={() => { setAddOpen(true); setEditingIdx(null); }}
                                        className="inline-flex items-center gap-1 rounded-xl bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 transition-colors"
                                    >
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        Add station
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
                            <table className="min-w-full text-left">
                                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="py-2.5 px-3">Name</th>
                                        <th className="py-2.5 px-3">Type</th>
                                        <th className="py-2.5 px-3">Province</th>
                                        <th className="py-2.5 px-3 text-right">MW</th>
                                        <th className="py-2.5 px-3">Operator</th>
                                        <th className="py-2.5 px-3">Year</th>
                                        <th className="py-2.5 px-3">Lat / Lng</th>
                                        <th className="py-2.5 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {addOpen && (
                                        <EditRow
                                            draft={newStation}
                                            onChange={(k, v) => setNewStation(d => ({ ...d, [k]: v }))}
                                            onSave={handleAdd}
                                            onCancel={() => { setAddOpen(false); setNewStation(emptyStation()); }}
                                        />
                                    )}
                                    {tableFiltered.map((s, filteredIdx) => {
                                        const realIdx = stations.indexOf(s);
                                        return editingIdx === realIdx ? (
                                            <EditRow
                                                key={realIdx}
                                                draft={editDraft}
                                                onChange={(k, v) => setEditDraft(d => ({ ...d, [k]: v }))}
                                                onSave={saveEdit}
                                                onCancel={() => { setEditingIdx(null); setEditDraft(null); }}
                                            />
                                        ) : (
                                            <StationRow
                                                key={realIdx}
                                                station={s}
                                                idx={realIdx}
                                                onEdit={startEdit}
                                                onToggleHide={handleToggleHide}
                                                onDelete={setConfirmDeleteIdx}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
