// Side-effect-only module: importing this (from anywhere) configures Amplify
// before that importing module's own code runs. Import it directly at the
// top of any file that calls an Amplify service (auth, generateClient, etc)
// - don't rely on this being *rendered* first, since Next/Turbopack doesn't
// guarantee that ordering across separate route modules.
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
