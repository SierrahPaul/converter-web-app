
import { Suspense } from "react";
import YouTubeClient from '@/components/YoutubeClient';

export default function YouTubePage() {
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <YouTubeClient />
        </Suspense>
    );
}