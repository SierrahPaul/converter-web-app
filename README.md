This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Site is hosted at [Link](https://converter-web-app.vercel.app/). *Vercel hosted sites cannot be viewed on MSU Secure or MSU Guest due to their security measures.

Presentation can be seen at [here](https://1drv.ms/p/c/059c887a9e7db09c/IQB8R7qWtxPSSaxbavHnsRXlAQQ6xxaFuoD0VO0mQtdTZPM?e=7tcRIt).


## Getting Started/setup

The Spotify to YouTube Music converter requires the use of a .env (environment file) to provide authorization to use the application. This will need to be added when cloned 
You will need developer access via Google Cloud and Spotify Developer credentials for the .env file:

(Google Cloud Oauth credentials for YouTube API)  
CLIENT_ID=###  
CLIENT_SECRET=###  
REDIRECT_URI=### //must be the same on Google Cloud with a route to ../api/oauth2/callback, e.g., http://localhost:3000/api/oauth2/callback  
NEXT_PUBLIC_HOST=### //same as Google Cloud URI but without directory extensions, e.g., http://localhost:3000  

(Spotify API Credentials)  
SPOTIFY_CLIENT_ID=###  
SPOTIFY_CLIENT_SECRET=###  
SPOTIFY_REDIRECT_URI=### //Optional for future development: required for Spotify playlists that are non-public or Spotify-generated, not public user-created playlists  

## download dependencies in package.json using the command line

"@radix-ui/react-slot": "^1.2.4",  
    "better-sqlite3": "^12.4.6",  
    "class-variance-authority": "^0.7.1",  
    "clsx": "^2.1.1",  
    "googleapis": "^166.0.0",  
    "init": "^0.1.2",  
    "lucide-react": "^0.554.0",  
    "next": "16.0.1",  
    "react": "19.2.0",  
    "react-dom": "19.2.0",  
    "shadcn": "^3.5.0",  
    "spotify-web-api-node": "^5.0.2",  
    "tailwind-merge": "^3.4.0"  


Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


The Spotify to YouTube Music converter requires the use of a .env (environment file) to provide authorization to use the application. 

## Application Features

Primary Function:
Takes a URL from public/user-created Spotify playlists and ports them to YouTube playlists. The app does not need Spotify user Authorization, only Google/YouTube to add playlists to your account.
While in the testing phase, Google Cloud requires that Google accounts be added as test users to be able to use the converter. Once published on Google Cloud, Google users will be able to use the converter without prior authorization from the developers. 

Redis Caching:
If playlists with the same YouTube track IDs are added, the IDs are added to the database for faster queries and reduced unit usage for the YouTube API. As the application is currently configured, the number of tracks ported from each playlist is 25 tracks; this is because the YouTube API has a limit on how many query units can be used in a day for a single application (this is for the Google Cloud trial accounts). The Redis Red River allows more usage of the application if similar tracks exist, because YouTube performs fewer queries as a result. The number of uses of the application is roughly 3-5 times a day, depending on whether there are similar tracks involved.  

Mix Spotify and YouTube Styling:
UI changes between Spotify and YouTube branding colors, adding emphasis to the conversion process.   

## Contributions:

Sierrah Paul: handled the frontend styling contributions, including TypeScript, JavaScript, Tailwind CSS, web hosting configurations, and Redis Red River configuration on Vercel.  
Nathan Mosher: handled the backend functionality, including .env configuration, JSON, TypeScript routing, Database configuration, and setup of Spotify/YouTube APIs.
