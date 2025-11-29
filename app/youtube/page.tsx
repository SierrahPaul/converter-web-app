"use client";

import { useSearchParams } from 'next/navigation';
import '@/styles/youtube.css';
import LogoBar from '../../components/LogoBar'

export default function YouTubePage() {
    const params = useSearchParams();
    const status = params.get("status");
    const imported = params.get("imported");
    const url = params.get("url");
    const reason = params.get("reason");

    return (
        <html lang="en">
            <body>
                <header>
                    <LogoBar />
                </header>

                <main>
                    <div className="main-content">
                    {status === "success" && imported && url ? (
                        <div className="alert success-alert">
                            <h1>Success!</h1>
                            <p>Imported {imported} tracks!</p>
                            <a href={url} target="_blank" className="link">View Playlist on YouTube Music</a>
                        </div>
                    ) : (
                        <div className="alert error-alert">
                            <h1>Error!</h1>
                            <p>{reason}</p>
                        </div>
                    )}

                    <a href="/dashboard" className="back-link">Convert another playlist!</a>
                    </div>
                </main>
            </body>
        </html>
    );
}