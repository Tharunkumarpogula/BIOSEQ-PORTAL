import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Simple in-memory user store for demo
// In production, use a database like Vercel Postgres
const users: Map<string, { id: string; name: string; email: string; password: string }> = new Map();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = users.get(email.toLowerCase());

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}