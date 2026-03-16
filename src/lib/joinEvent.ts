import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@tabletop.app'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

type JoinPayload = {
  eventId: string
  eventTitle: string
  eventLocation: string
  eventDateTime: string
  eventNotes?: string
  hostName: string
  hostEmail: string
  joinerName: string
  joinerEmail: string
}

export const joinEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => data as JoinPayload)
  .handler(async ({ data }) => {
    const supabase = getSupabase()

    const { error: insertError } = await supabase
      .from('attendees')
      .insert({ event_id: data.eventId, name: data.joinerName, email: data.joinerEmail })

    if (insertError) {
      throw new Error('Failed to join event')
    }

    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: data.joinerEmail,
        subject: `You're in! ${data.eventTitle}`,
        html: joinerEmailHtml(data),
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: data.hostEmail,
        subject: `New player joined: ${data.eventTitle}`,
        html: hostEmailHtml(data),
      }),
    ])

    return { success: true }
  })

function joinerEmailHtml(d: JoinPayload) {
  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #f1f5f9; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Logo header -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="width: 40px; height: 40px; background: #4f46e5; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92A2.24 2.24 0 0 0 13 2.06a2.27 2.27 0 0 0-1.6.66L5 9"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>
                    </div>
                  </td>
                  <td style="padding-left: 10px; vertical-align: middle;">
                    <span style="font-size: 20px; font-weight: 600; color: #1e293b; letter-spacing: -0.3px;">Tabletop</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <div style="background: #4f46e5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 22px;">You're in, ${d.joinerName}!</h1>
                <p style="color: #c7d2fe; margin: 8px 0 0;">Your spot is confirmed for <strong>${d.eventTitle}</strong></p>
              </div>

              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">When</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.eventDateTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Where</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.eventLocation}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Host</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.hostName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Contact</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${d.hostEmail}" style="color: #4f46e5;">${d.hostEmail}</a></td>
                  </tr>
                  ${d.eventNotes ? `<tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Notes</td>
                    <td style="padding: 8px 0; font-size: 14px;">${d.eventNotes}</td>
                  </tr>` : ''}
                </table>
              </div>

              <p style="color: #64748b; font-size: 14px;">Have questions? Reach out to your host directly at <a href="mailto:${d.hostEmail}" style="color: #4f46e5;">${d.hostEmail}</a>.</p>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">See you at the table!</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function hostEmailHtml(d: JoinPayload) {
  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #f1f5f9; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Logo header -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="width: 40px; height: 40px; background: #4f46e5; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92A2.24 2.24 0 0 0 13 2.06a2.27 2.27 0 0 0-1.6.66L5 9"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>
                    </div>
                  </td>
                  <td style="padding-left: 10px; vertical-align: middle;">
                    <span style="font-size: 20px; font-weight: 600; color: #1e293b; letter-spacing: -0.3px;">Tabletop</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <div style="background: #4f46e5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 22px;">New player joined!</h1>
                <p style="color: #c7d2fe; margin: 8px 0 0;"><strong>${d.joinerName}</strong> signed up for <strong>${d.eventTitle}</strong></p>
              </div>

              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Name</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.joinerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${d.joinerEmail}" style="color: #4f46e5;">${d.joinerEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Event</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">When</td>
                    <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${d.eventDateTime}</td>
                  </tr>
                  ${d.eventNotes ? `<tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Notes</td>
                    <td style="padding: 8px 0; font-size: 14px;">${d.eventNotes}</td>
                  </tr>` : ''}
                </table>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
