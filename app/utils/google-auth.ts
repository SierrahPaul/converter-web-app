//working code 
// app/utils/google-auth.ts
import { google } from 'googleapis';
import 'server-only';

// Force crash on startup if any env var is missing or empty
if (!process.env.CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID');
if (!process.env.CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET');
if (!process.env.REDIRECT_URI) throw new Error('Missing GOOGLE_REDIRECT_URI');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI   // ← this MUST be a real string here
);
export default oauth2Client;
