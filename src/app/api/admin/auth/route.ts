import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = 'sushiakiadmin';
const ADMIN_PASSWORD = 'sushiaki123';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true, message: 'Login successful' });
            // Set a simple cookie for session management
            response.cookies.set('admin_auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/', // Alterado para '/' para garantir que seja lido em /admin
            });
            return response;
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}