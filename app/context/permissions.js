"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { apiClient as client } from "@/app/lib/apiClient";
import { useAuth } from "./auth";

const PermissionsCtx = createContext(null);

// isAdmin is real Cognito "Admins" group membership - not a DB record, so it
// can never be self-granted through a data write (unlike the original app's
// __admin__.superAdmins PageContent record). editablePages is still a DB
// record (AdminPermission), but only the Admins group can write it.
export function PermissionsProvider({ children }) {
    const { user } = useAuth();
    const [permissions, setPermissions] = useState(null); // { isAdmin, editablePages }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!user?.email) {
                if (!cancelled) {
                    setPermissions(null);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                const session = await fetchAuthSession();
                const groups = session.tokens?.accessToken?.payload["cognito:groups"] ?? [];
                const isAdmin = groups.includes("Admins");

                let editablePages = [];
                try {
                    const res = await client.models.AdminPermission.adminPermissionByEmail({ email: user.email });
                    editablePages = res.data?.[0]?.editablePages ?? [];
                } catch {}

                if (!cancelled) setPermissions({ isAdmin, editablePages });
            } catch {
                if (!cancelled) setPermissions({ isAdmin: false, editablePages: [] });
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [user?.email]);

    /**
     * canEdit(pageKey)
     * Returns true if the current user is allowed to edit the given page.
     *
     * Wildcard rules:
     *   "*"            → can edit everything
     *   "ec.station.*" → can edit any page whose key starts with "ec.station."
     */
    const canEdit = useCallback((pageKey) => {
        if (!user || !permissions) return false;
        if (permissions.isAdmin) return true;
        if (!permissions.editablePages?.length) return false;

        return permissions.editablePages.some((p) => {
            if (p === "*")      return true;
            if (p === pageKey)  return true;
            if (p.endsWith(".*")) {
                const prefix = p.slice(0, -1); // "ec.station." (keeps the dot)
                return pageKey.startsWith(prefix);
            }
            return false;
        });
    }, [user, permissions]);

    const isAdmin = !!permissions?.isAdmin;

    return (
        <PermissionsCtx.Provider value={{ permissions, loading, canEdit, isAdmin }}>
            {children}
        </PermissionsCtx.Provider>
    );
}

export function usePermissions() {
    const ctx = useContext(PermissionsCtx);
    if (!ctx) throw new Error("usePermissions must be used within <PermissionsProvider>");
    return ctx;
}
