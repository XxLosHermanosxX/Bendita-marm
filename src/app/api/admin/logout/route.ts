import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    // Clear the cookie by setting its expiration to the past
    response.cookies.set('admin_auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        path: '/',
    });
    return response;
}