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
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b;">
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
    </table>
  </div>

  <p style="color: #64748b; font-size: 14px;">Have questions? Reach out to your host directly at <a href="mailto:${d.hostEmail}" style="color: #4f46e5;">${d.hostEmail}</a>.</p>
  <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">See you at the table!</p>
</body>
</html>`
}

function hostEmailHtml(d: JoinPayload) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b;">
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
    </table>
  </div>

  <p style="color: #64748b; font-size: 14px;">Reply directly to this email or reach them at <a href="mailto:${d.joinerEmail}" style="color: #4f46e5;">${d.joinerEmail}</a>.</p>
</body>
</html>`
}
