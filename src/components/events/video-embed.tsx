
'use client';

import { cn } from "@/lib/utils";

type VideoEmbedProps = {
    url: string;
    className?: string;
}

function getEmbedUrl(url: string): string | null {
    if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (url.includes('youtu.be/')) {
        const videoId = new URL(url).pathname.substring(1);
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
        const videoId = new URL(url).pathname.substring(1);
        return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
};


export function VideoEmbed({ url, className }: VideoEmbedProps) {
    const embedUrl = getEmbedUrl(url);

    if (!embedUrl) {
        return null;
    }

    return (
        <div className={cn("aspect-video w-full rounded-lg overflow-hidden", className)}>
            <iframe
                src={embedUrl}
                title="Embedded video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    )
}

    