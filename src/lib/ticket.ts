
// ── Ticket utilities for Yahya Hub ───────────────────────────────────────────

export type TicketType = "WS" | "CS" | "EV";

/** Generate a unique ticket ID: YH-WS-20250619-A1B2 */
export function generateTicketId(type: TicketType): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `YH-${type}-${date}-${rand}`;
}

/** Escape user-supplied strings before embedding in email HTML */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}



export type TicketData = {
  ticketId: string;
  type: "workspace" | "course" | "event";
  typeLabel: string;         // "Workspace Booking" | "Course Enrollment" | "Event Registration"
  holderName: string;
  email: string;
  phone: string;
  title: string;             // workspace/course/event name
  date: string;
  time?: string;
  location?: string;
  amount: number;            // in Naira, 0 = free
  extraRows?: { label: string; value: string }[];
  siteUrl: string;
};

function formatNaira(n: number) {
  return n === 0 ? "Free" : `₦${n.toLocaleString("en-NG")}`;
}

const BRAND_NAVY  = "#013156";
const BRAND_SKY   = "#36BCEC";
const BRAND_AMBER = "#DBA700";

const TYPE_COLORS: Record<string, string> = {
  workspace: BRAND_NAVY,
  course:    "#065f46",   // emerald
  event:     "#6d28d9",   // violet
};

const TYPE_BADGE: Record<string, string> = {
  workspace: BRAND_SKY,
  course:    "#34d399",
  event:     "#c4b5fd",
};

/** Build the complete HTML email with embedded ticket */
export function buildTicketEmail(d: TicketData): string {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(d.ticketId)}&bgcolor=ffffff&color=013156&margin=8`;
  const headerBg = TYPE_COLORS[d.type] ?? BRAND_NAVY;
  const badgeBg  = TYPE_BADGE[d.type]  ?? BRAND_SKY;
  const trackUrl = `${d.siteUrl}/tracking?track=${d.ticketId}`;

  const extraHtml = (d.extraRows ?? [])
    .map(r => `
      <tr>
        <td style="padding:6px 0;color:#6b7280;font-size:13px;width:130px">${esc(r.label)}</td>
        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(r.value)}</td>
      </tr>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${d.typeLabel} — ${esc(d.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px">

        <!-- ── Card ─────────────────────────────────────────────── -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)">

          <!-- Header -->
          <tr>
            <td style="background:${headerBg};padding:28px 32px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-.3px">
                      Yahya Hub
                    </p>
                    <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,.70)">
                      ${d.typeLabel}
                    </p>
                  </td>
                  <td align="right">
                    <span style="background:${badgeBg};color:${headerBg};padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">
                      CONFIRMED ✓
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hi, Name! -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px 0">
              <p style="margin:0;font-size:18px;font-weight:600;color:#111827">
                Hello, ${esc(d.holderName)}!
              </p>
              <p style="margin:8px 0 0;font-size:14px;color:#6b7280;line-height:1.6">
                Your ${d.typeLabel.toLowerCase()} is confirmed. Please find your ticket details below.
                Keep this email — you'll need it at the venue or for your records.
              </p>
            </td>
          </tr>

          <!-- ── Ticket ──────────────────────────────────────────── -->
          <tr>
            <td style="background:#ffffff;padding:24px 32px">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="border:2px solid #e5e7eb;border-radius:12px;overflow:hidden">

                <!-- Ticket header stripe -->
                <tr>
                  <td colspan="3"
                      style="background:linear-gradient(135deg,${headerBg} 0%,${headerBg}cc 100%);padding:14px 20px">
                    <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff">${esc(d.title)}</p>
                    <p style="margin:3px 0 0;font-size:12px;color:rgba(255,255,255,.75)">${d.typeLabel}</p>
                  </td>
                </tr>

                <!-- Ticket body: details | divider | QR -->
                <tr>
                  <!-- Details -->
                  <td style="padding:20px 20px;vertical-align:top;width:340px">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px;width:110px">Date</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.date)}</td>
                      </tr>
                      ${d.time ? `<tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Time</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.time)}</td>
                      </tr>` : ""}
                      ${d.location ? `<tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Location</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.location)}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Holder</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.holderName)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Email</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.email)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Phone</td>
                        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500">${esc(d.phone)}</td>
                      </tr>
                      ${extraHtml}
                      <tr><td colspan="2"><div style="height:12px"></div></td></tr>
                      <tr>
                        <td style="padding:6px 0;color:#6b7280;font-size:13px">Amount</td>
                        <td style="padding:6px 0;font-size:16px;font-weight:700;color:${headerBg}">${formatNaira(d.amount)}</td>
                      </tr>
                    </table>
                  </td>

                  <!-- Perforated divider -->
                  <td style="width:1px;border-left:2px dashed #d1d5db;padding:0"></td>

                  <!-- QR + Ticket Number -->
                  <td style="padding:20px 16px;text-align:center;vertical-align:middle">
                    <p style="margin:0 0 8px;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#9ca3af;text-transform:uppercase">
                      Ticket No.
                    </p>
                    <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${headerBg};word-break:break-all;line-height:1.4">
                      ${d.ticketId}
                    </p>
                    <img src="${qrUrl}" width="120" height="120"
                         alt="QR Code for ${d.ticketId}"
                         style="display:block;margin:0 auto;border-radius:8px;border:1px solid #e5e7eb" />
                    <p style="margin:10px 0 0;font-size:10px;color:#9ca3af">Scan to verify</p>
                  </td>
                </tr>

                <!-- Ticket footer strip -->
                <tr>
                  <td colspan="3"
                      style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 20px;text-align:center">
                    <p style="margin:0;font-size:11px;color:#6b7280">
                      Present this ticket at the venue &nbsp;·&nbsp;
                      <a href="${trackUrl}" style="color:${headerBg};text-decoration:none;font-weight:600">
                        Track your booking →
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's next -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 28px">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                     style="background:#f0f9ff;border-radius:10px;border:1px solid #bae6fd;padding:16px 20px">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${BRAND_NAVY}">📋 What's next?</p>
                    <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:2">
                      <li>Save or print this email as your ticket</li>
                      <li>Arrive on time and present your ticket ID: <strong>${d.ticketId}</strong></li>
                      <li>Contact us at <a href="mailto:yahyahub6@gmail.com" style="color:${headerBg}">yahyahub6@gmail.com</a> for any changes</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BRAND_NAVY};padding:20px 32px;text-align:center">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,.60)">
                © ${new Date().getFullYear()} Yahya Hub · Abuja, Nigeria &nbsp;·&nbsp;
                <a href="https://www.instagram.com/yahyahub/" style="color:rgba(255,255,255,.60);text-decoration:none">@yahyahub</a>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,.40)">
                This is an automated confirmation. Ticket ID: ${d.ticketId}
              </p>
            </td>
          </tr>

        </table>
        <!-- ── /Card ───────────────────────────────────────────── -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}
