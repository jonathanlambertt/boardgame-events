import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Logo } from '../components/Logo'

export const Route = createFileRoute('/terms')({ component: TermsPage })

function TermsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const darkModeInitialized = useRef(false)

  useEffect(() => {
    if (!darkModeInitialized.current) {
      darkModeInitialized.current = true
      setDarkMode(localStorage.getItem('darkMode') === 'true')
    }
  }, [])

  const prose = darkMode
    ? 'text-ink-300'
    : 'text-ink-600'

  const heading = darkMode ? 'text-white' : 'text-ink-900'
  const subheading = darkMode ? 'text-ink-100' : 'text-ink-800'
  const muted = darkMode ? 'text-ink-400' : 'text-ink-500'

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
          className={`font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-10 ${heading}`}
        >
          Terms of service
        </h1>

        <Section heading="1. Acceptance of Terms" headingClass={subheading} proseClass={prose}>
          By accessing or using Tabletop ("the Service"), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the Service.
        </Section>

        <Section heading="2. Eligibility" headingClass={subheading} proseClass={prose}>
          You must be at least 18 years old to use Tabletop. By using the Service, you represent
          and warrant that you meet this age requirement. We reserve the right to terminate
          accounts of users who misrepresent their age.
        </Section>

        <Section heading="3. Description of Service" headingClass={subheading} proseClass={prose}>
          Tabletop is a community platform that allows users to discover, host, and join local
          board game events. The Service is provided on a personal, non-commercial basis. We do
          not guarantee the availability, accuracy, or continuity of any events listed on the
          platform.
        </Section>

        <Section heading="4. Hosting Events" headingClass={subheading} proseClass={prose}>
          When you create an event on Tabletop, you are solely responsible for the accuracy of
          the event details, including date, time, location, and game information. You agree not
          to create events that are misleading, fraudulent, or intended to harm other users. You
          acknowledge that Tabletop is not responsible for any outcomes arising from events you
          host.
        </Section>

        <Section heading="5. Joining Events" headingClass={subheading} proseClass={prose}>
          When you join an event, you provide your name and email address to receive event
          confirmation. You understand that your name may be visible to the event host. Tabletop
          is not responsible for cancellations, no-shows, or any disputes between hosts and
          attendees. Attending any event is at your own discretion and risk.
        </Section>

        <Section heading="6. User Conduct" headingClass={subheading} proseClass={prose}>
          You agree not to use the Service to:{' '}
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Post false, misleading, or fraudulent event information</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Collect other users' personal information without consent</li>
            <li>Violate any applicable local, state, or federal laws</li>
            <li>Spam or send unsolicited communications to other users</li>
          </ul>
          We reserve the right to remove events and suspend users who violate these standards
          without prior notice.
        </Section>

        <Section heading="7. Intellectual Property" headingClass={subheading} proseClass={prose}>
          All content, branding, and design elements of Tabletop are the property of the Service
          operator. Board game names, images, and trademarks referenced on the platform belong
          to their respective owners. Tabletop makes no claim of ownership over third-party game
          intellectual property.
        </Section>

        <Section heading="8. Disclaimer of Warranties" headingClass={subheading} proseClass={prose}>
          The Service is provided "as is" and "as available" without warranties of any kind,
          express or implied. We do not warrant that the Service will be uninterrupted,
          error-free, or free of harmful components. Use of the Service is at your sole risk.
        </Section>

        <Section heading="9. Limitation of Liability" headingClass={subheading} proseClass={prose}>
          To the fullest extent permitted by law, Tabletop and its operator shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages arising from
          your use of the Service, including but not limited to personal injury, property damage,
          or any outcomes resulting from in-person events facilitated through the platform.
        </Section>

        <Section heading="10. Changes to These Terms" headingClass={subheading} proseClass={prose}>
          We may update these Terms of Service from time to time. When we do, we will update the
          "Last updated" date at the top of this page. Your continued use of the Service after
          any changes constitutes your acceptance of the revised terms.
        </Section>

        <Section heading="11. Contact" headingClass={subheading} proseClass={prose}>
          If you have questions about these Terms, please contact us at{' '}
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
