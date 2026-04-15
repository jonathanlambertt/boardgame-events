import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Logo } from '../components/Logo'

export const Route = createFileRoute('/privacy')({ component: PrivacyPage })

function PrivacyPage() {
  const [darkMode, setDarkMode] = useState(false)
  const darkModeInitialized = useRef(false)

  useEffect(() => {
    if (!darkModeInitialized.current) {
      darkModeInitialized.current = true
      setDarkMode(localStorage.getItem('darkMode') === 'true')
    }
  }, [])

  const prose = darkMode ? 'text-ink-300' : 'text-ink-600'
  const heading = darkMode ? 'text-white' : 'text-ink-900'
  const subheading = darkMode ? 'text-ink-100' : 'text-ink-800'
  const muted = darkMode ? 'text-ink-400' : 'text-ink-500'
  const card = darkMode
    ? 'bg-ink-900 border-ink-800'
    : 'bg-ink-50 border-ink-100'

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-ink-950' : 'bg-white'
      }`}
    >
      {/* Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${
          darkMode
            ? 'bg-ink-950/90 border-ink-800/80 backdrop-blur-md'
            : 'bg-white/90 border-ink-100 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center px-6 py-3.5 max-w-3xl mx-auto w-full gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              darkMode ? 'text-ink-400 hover:text-white' : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            <ArrowLeftIcon size={16} />
            Back
          </Link>
          <div className="flex items-center gap-2 mx-auto">
            <Logo size={26} />
            <span
              className={`font-display text-xl font-semibold tracking-tight ${heading}`}
            >
              Tabletop
            </span>
          </div>
          {/* Spacer to keep title centered */}
          <div className="w-12" />
        </div>
      </nav>

      {/* Content */}
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <p className={`text-sm mb-3 ${muted}`}>Last updated: April 13, 2026</p>
        <h1
          className={`font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-5 ${heading}`}
        >
          Privacy policy
        </h1>
        <p className={`text-base leading-relaxed mb-10 ${prose}`}>
          Your privacy matters. This policy explains what personal information Tabletop collects,
          how it is used, and how it is protected. We keep things simple because we collect very
          little.
        </p>

        {/* At-a-glance summary card */}
        <div className={`rounded-2xl border p-6 mb-12 ${card}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>
            At a glance
          </p>
          <ul className="space-y-2">
            {[
              'We collect your name and email only when you join or host an event.',
              'We do not use cookies or any analytics tracking.',
              'We do not sell or share your data with third parties for marketing.',
              'You may request deletion of your data at any time.',
            ].map((item) => (
              <li key={item} className={`flex items-start gap-2 text-sm ${prose}`}>
                <span className="text-primary-500 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Section heading="1. Information We Collect" headingClass={subheading} proseClass={prose}>
          We collect the following personal information:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong className={subheading}>Attendee name and email</strong> — provided when
              you RSVP to join an event.
            </li>
            <li>
              <strong className={subheading}>Host email address</strong> — provided when you
              create an event.
            </li>
          </ul>
          <p className="mt-3">
            We do not collect payment information, location data, device identifiers, or any
            other personal data.
          </p>
        </Section>

        <Section heading="2. How We Use Your Information" headingClass={subheading} proseClass={prose}>
          We use your information solely to operate the Service:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong className={subheading}>Event confirmations</strong> — your email is used
              to send a one-time confirmation when you join an event.
            </li>
            <li>
              <strong className={subheading}>Attendee tracking</strong> — your name and email
              are stored with the event so the host knows who to expect.
            </li>
          </ul>
          <p className="mt-3">
            We do not send marketing emails, newsletters, or promotional messages. We will only
            contact you in direct relation to an event you participated in.
          </p>
        </Section>

        <Section heading="3. Cookies and Tracking" headingClass={subheading} proseClass={prose}>
          Tabletop does not use cookies, tracking pixels, or third-party analytics tools (such
          as Google Analytics). The only data stored in your browser is your dark mode preference,
          saved in{' '}
          <code
            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
              darkMode ? 'text-primary-400 bg-ink-900' : 'text-primary-600 bg-ink-100'
            }`}
          >
            localStorage
          </code>{' '}
          on your device. This never leaves your browser.
        </Section>

        <Section heading="4. Data Storage and Security" headingClass={subheading} proseClass={prose}>
          Your data is stored securely using{' '}
          <strong className={subheading}>Supabase</strong>, a hosted PostgreSQL database
          provider. Event confirmation emails are delivered via{' '}
          <strong className={subheading}>Resend</strong>. Both services maintain industry-standard
          security practices. While we take reasonable precautions to protect your information,
          no method of internet transmission is 100% secure.
        </Section>

        <Section heading="5. Data Sharing" headingClass={subheading} proseClass={prose}>
          We do not sell, rent, or trade your personal information. Your data is shared only as
          follows:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong className={subheading}>With event hosts</strong> — when you join an event,
              your name is visible to the host so they can manage their guest list.
            </li>
            <li>
              <strong className={subheading}>With service providers</strong> — Supabase (database)
              and Resend (email delivery) process data on our behalf under their respective
              privacy policies.
            </li>
          </ul>
        </Section>

        <Section heading="6. Data Retention" headingClass={subheading} proseClass={prose}>
          We retain event and attendee records for as long as is necessary to operate the
          Service. If you would like your data removed, please contact us and we will delete
          your records within a reasonable timeframe.
        </Section>

        <Section heading="7. Your Rights" headingClass={subheading} proseClass={prose}>
          You have the right to:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:contact@tabletop.sh"
              className="text-primary-500 hover:text-primary-400 underline underline-offset-2"
            >
              contact@tabletop.sh
            </a>
            .
          </p>
        </Section>

        <Section heading="8. Children's Privacy" headingClass={subheading} proseClass={prose}>
          Tabletop is intended for users who are 18 years of age or older. We do not knowingly
          collect personal information from anyone under 18. If you believe we have inadvertently
          collected such information, please contact us and we will delete it promptly.
        </Section>

        <Section heading="9. Changes to This Policy" headingClass={subheading} proseClass={prose}>
          We may update this Privacy Policy from time to time. When we do, we will update the
          "Last updated" date at the top of this page. We encourage you to review this policy
          periodically.
        </Section>

        <Section heading="10. Contact" headingClass={subheading} proseClass={prose}>
          Questions or concerns about your privacy? Reach us at{' '}
          <a
            href="mailto:contact@tabletop.sh"
            className="text-primary-500 hover:text-primary-400 underline underline-offset-2"
          >
            contact@tabletop.sh
          </a>
          .
        </Section>
      </main>
    </div>
  )
}

function Section({
  heading,
  headingClass,
  proseClass,
  children,
}: {
  heading: string
  headingClass: string
  proseClass: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className={`font-display text-xl font-semibold tracking-tight mb-3 ${headingClass}`}>
        {heading}
      </h2>
      <div className={`text-[15px] leading-relaxed ${proseClass}`}>{children}</div>
    </section>
  )
}
