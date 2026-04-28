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
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.send",
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

// Récupère TOUS les thread IDs via pagination (nextPageToken), sans fetch les détails
export async function listAllGmailThreadIds(
  accessToken: string,
  refreshToken: string | undefined,
  query: string = '-in:spam -in:trash',
  maxTotal: number = 500
): Promise<string[]> {
  const client = getOAuth2Client()
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })

  const allIds: string[] = []
  let pageToken: string | undefined = undefined

  while (allIds.length < maxTotal) {
    const pageSize = Math.min(maxTotal - allIds.length, 500)
    const { data } = await gmail.users.threads.list({
      userId: 'me',
      q: query,
      maxResults: pageSize,
      ...(pageToken ? { pageToken } : {}),
    })

    const threads = data.threads || []
    for (const t of threads) {
      if (t.id) allIds.push(t.id)
    }
    if (!data.nextPageToken || threads.length === 0) break
    pageToken = data.nextPageToken as string
  }

  return allIds
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

// ---- Nouvelles fonctions reply / delete ----

export async function getGmailMessage(
  accessToken: string,
  refreshToken: string | undefined,
  messageId: string
) {
  const client = getOAuth2Client()
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })
  const { data } = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  })
  return data
}

function encodeMessage(headers: Record<string, string>, body: string): string {
  const headerStr = Object.entries(headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\r\n')
  const raw = `${headerStr}\r\n\r\n${body}`
  return Buffer.from(raw).toString('base64url')
}

export async function sendGmailReply(
  accessToken: string,
  refreshToken: string | undefined,
  threadId: string,
  inReplyTo: string,
  to: string,
  subject: string,
  body: string,
  attachments: { name: string; mimeType: string; data: string }[] = []
) {
  const client = getOAuth2Client()
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })

  const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`
  const boundary = `boundary_${Date.now()}`

  let raw: string
  if (attachments.length === 0) {
    raw = encodeMessage(
      {
        'To': to,
        'Subject': replySubject,
        'In-Reply-To': inReplyTo,
        'References': inReplyTo,
        'Content-Type': 'text/plain; charset=utf-8',
        'MIME-Version': '1.0',
      },
      body
    )
  } else {
    // Build multipart/mixed MIME message
    const parts = [
      `--${boundary}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      body,
      ...attachments.flatMap(att => [
        `--${boundary}`,
        `Content-Type: ${att.mimeType}; name="${att.name}"`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${att.name}"`,
        '',
        att.data,
      ]),
      `--${boundary}--`,
    ].join('\r\n')

    const headers = [
      `To: ${to}`,
      `Subject: ${replySubject}`,
      `In-Reply-To: ${inReplyTo}`,
      `References: ${inReplyTo}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ].join('\r\n')

    raw = Buffer.from(`${headers}\r\n\r\n${parts}`).toString('base64url')
  }

  const { data } = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw, threadId },
  })
  return data
}

export async function trashGmailThread(
  accessToken: string,
  refreshToken: string | undefined,
  threadId: string
) {
  const client = getOAuth2Client()
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })
  await gmail.users.threads.trash({ userId: 'me', id: threadId })
}

export async function markGmailThreadRead(
  accessToken: string,
  refreshToken: string | undefined,
  threadId: string
) {
  const client = getOAuth2Client()
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })
  await gmail.users.threads.modify({
    userId: 'me',
    id: threadId,
    requestBody: { removeLabelIds: ['UNREAD'] },
  })
}
