import { PropsWithChildren } from "react";
import { PostHogProvider } from "posthog-js/react";

export const PostHogProviderWrapper = ({ children }: PropsWithChildren) => {
    if (window.location.host.includes('localhost')) return <>{children}</>;
    return (
        <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={{
                api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
                defaults: '2025-05-24',
                capture_exceptions: true, // This enables capturing exceptions using Error Tracking
                debug: import.meta.env.MODE === 'development',
            }}
        >
            {children}
        </PostHogProvider>
    );
};
