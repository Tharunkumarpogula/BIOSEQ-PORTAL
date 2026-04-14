import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory user store for demo
// In production, use a database like Vercel Postgres
const users: Map<string, { id: string; name: string; email: string; password: string }> = new Map();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();

        if (users.has(emailLower)) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email: emailLower,
            password,
        };

        users.set(emailLower, newUser);

        return NextResponse.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}