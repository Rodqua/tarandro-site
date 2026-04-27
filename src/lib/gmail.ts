import { google } from "googleapis";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL}/api/mail/connect/callback`
  );
}

export function getGmailAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
    state: "google",
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getUserInfo(accessToken: string) {
  const client = getOAuth2Client();
  client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();
  return { email: data.email || "", name: data.name || "" };
}

export async function listGmailThreads(
  accessToken: string,
  refreshToken?: string,
  query = "is:unread",
  maxResults = 50
) {
  const client = getOAuth2Client();
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  const gmail = google.gmail({ version: "v1", auth: client });

  const { data } = await gmail.users.threads.list({
    userId: "me",
    q: query,
    maxResults,
  });

  return data.threads || [];
}

export async function getGmailThread(
  accessToken: string,
  refreshToken: string | undefined,
  threadId: string
) {
  const client = getOAuth2Client();
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  const gmail = google.gmail({ version: "v1", auth: client });

  const { data } = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
    format: "metadata",
    metadataHeaders: ["Subject", "From", "Date", "To"],
  });

  return data;
}

export function categorizeEmail(sender: string, subject: string): string {
  const s = sender.toLowerCase();
  const sub = subject.toLowerCase();

  if (
    s.includes("has-sante.fr") ||
    s.includes("ansm.integra.fr") ||
    s.includes("ordre.pharmacien.fr") ||
    sub.includes("has –") ||
    sub.includes("ansm :")
  )
    return "veille";

  if (
    s.includes("llaec.fr") ||
    s.includes("dgfip") ||
    s.includes("urssaf") ||
    s.includes("unipros") ||
    s.includes("cic.fr") ||
    s.includes("impots.gouv") ||
    sub.includes("facture") ||
    sub.includes("bilan") ||
    sub.includes("comptab") ||
    sub.includes("capitation")
  )
    return "compta";

  if (
    s.includes("calendar-notification") ||
    sub.includes("nouvel événement") ||
    sub.includes("invitation") ||
    sub.includes("rappel")
  )
    return "events";

  if (
    s.includes("protonmail") ||
    s.includes("gldf.org") ||
    sub.includes("tenue") ||
    sub.includes("loge") ||
    sub.includes("maîtres") ||
    sub.includes("frater")
  )
    return "loge";

  if (
    s.includes("noreply") ||
    s.includes("no-reply") ||
    s.includes("newsletter") ||
    s.includes("rentila") ||
    s.includes("bnifrance") ||
    s.includes("ancv") ||
    s.includes("michaelpage") ||
    s.includes("hellowork")
  )
    return "newsletter";

  return "important";
}
