"use client";

export const trackEvent = async (event: string, details: Record<string, any> = {}) => {
    if (typeof window === 'undefined') return;

    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event, details }),
        });
    } catch (error) {
        console.error('Failed to send tracking event:', error);
    }
};