// Side-effect-only module: importing this (from anywhere) configures Amplify
// before that importing module's own code runs. Import it directly at the
// top of any file that calls an Amplify service (auth, generateClient, etc)
// - don't rely on this being *rendered* first, since Next/Turbopack doesn't
// guarantee that ordering across separate route modules.
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

// A single shared promise for the Cognito Identity Pool's unauthenticated
// ("guest") AWS credentials, started as early as possible - right after
// configure, before React even mounts - and exported so every caller that
// needs Storage credentials (useResolvedImageUrl) can await this SAME
// promise instead of each independently calling fetchAuthSession().
// Without this, several images mounting at once (e.g. the homepage's
// Energy Insights cards) each call Storage.getUrl(), and - because
// Amplify doesn't dedupe concurrent in-flight credential fetches - each
// one that fires before credentials are cached kicks off its own,
// separate Cognito Identity round trip: measured as ~2.4s of redundant,
// serialized network time on a cold homepage load, confirmed with a
// real network capture (7-10 separate Cognito Identity requests on one
// page load). Sharing this one promise collapses that back down to one
// real request, however many images are on the page.
//
// This only fetches the exact same scoped credentials every anonymous
// visitor already receives for public image reads - see
// amplify/storage/resource.ts: allow.guest.to(['read']) on insights/*
// only. No write access, nothing elevated, nothing new added to what the
// app already exposes; it just fetches it once, early, and shares it,
// instead of N times late. Fire-and-forget at the call site: a perf
// warm-up, not on any critical path, so a failure here (e.g. offline) is
// swallowed rather than surfaced - callers that await this and then call
// getUrl() themselves will hit the normal error path as before.
export const authSessionReady = fetchAuthSession().catch(() => {});
