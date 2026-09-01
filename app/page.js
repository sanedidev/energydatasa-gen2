"use client";

import { useEffect, useState } from "react";
import {
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    getCurrentUser,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export default function Home() {
    const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
    const [mode, setMode] = useState("signIn"); // signIn | signUp | confirm
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        if (!user) return;
        const sub = client.models.Todo.observeQuery().subscribe({
            next: ({ items }) => setTodos(items),
        });
        return () => sub.unsubscribe();
    }, [user]);

    async function handleSignUp(e) {
        e.preventDefault();
        setError("");
        try {
            await signUp({ username: email, password, options: { userAttributes: { email } } });
            setMode("confirm");
        } catch (err) {
            setError(err.message ?? "Sign up failed");
        }
    }

    async function handleConfirm(e) {
        e.preventDefault();
        setError("");
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            setMode("signIn");
        } catch (err) {
            setError(err.message ?? "Confirmation failed");
        }
    }

    async function handleSignIn(e) {
        e.preventDefault();
        setError("");
        try {
            await signIn({ username: email, password });
            setUser(await getCurrentUser());
        } catch (err) {
            setError(err.message ?? "Sign in failed");
        }
    }

    async function handleSignOut() {
        await signOut();
        setUser(null);
        setTodos([]);
    }

    async function handleAddTodo(e) {
        e.preventDefault();
        if (!newTodo.trim()) return;
        await client.models.Todo.create({ content: newTodo });
        setNewTodo("");
    }

    if (user === undefined) {
        return <main className="p-8">Loading...</main>;
    }

    if (!user) {
        return (
            <main className="max-w-sm mx-auto p-8">
                <h1 className="text-xl font-semibold mb-4">energydatasa-gen2 — connectivity test</h1>

                {error && (
                    <div className="mb-3 rounded bg-red-50 border border-red-200 p-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {mode === "signUp" && (
                    <form onSubmit={handleSignUp} className="space-y-3">
                        <input type="email" required placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <input type="password" required placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Sign up</button>
                        <button type="button" onClick={() => setMode("signIn")} className="text-sm text-slate-500">
                            Already have an account? Sign in
                        </button>
                    </form>
                )}

                {mode === "confirm" && (
                    <form onSubmit={handleConfirm} className="space-y-3">
                        <p className="text-sm text-slate-600">Enter the code emailed to {email}</p>
                        <input required placeholder="Confirmation code" value={code}
                            onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Confirm</button>
                    </form>
                )}

                {mode === "signIn" && (
                    <form onSubmit={handleSignIn} className="space-y-3">
                        <input type="email" required placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <input type="password" required placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Sign in</button>
                        <button type="button" onClick={() => setMode("signUp")} className="text-sm text-slate-500">
                            No account? Sign up
                        </button>
                    </form>
                )}
            </main>
        );
    }

    return (
        <main className="max-w-sm mx-auto p-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Todos</h1>
                <button onClick={handleSignOut} className="text-sm border rounded px-3 py-1.5">Sign out</button>
            </div>

            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="New todo" className="flex-1 border rounded px-3 py-2" />
                <button className="bg-slate-900 text-white rounded px-4 py-2">Add</button>
            </form>

            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="border rounded px-3 py-2">{todo.content}</li>
                ))}
                {todos.length === 0 && <li className="text-sm text-slate-500">No todos yet.</li>}
            </ul>
        </main>
    );
}
