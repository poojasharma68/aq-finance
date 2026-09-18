import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contact, offices } from "@/data/site";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact us",
  description: "Call, WhatsApp or write to Bala Ji Finance. Offices in Gurugram, Mumbai and Bengaluru.",
};

const channels = [
  { icon: Phone, label: "Call toll-free", value: contact.phone, href: contact.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: contact.whatsapp, href: contact.whatsappHref },
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact us"
        eyebrow="Contact"
        lines={["Talk to a person,", <em key="bot" className="text-saffron-ink">not a bot.</em>]}
        description="Questions about a loan, an application in progress, or a partnership — reach us the way that suits you."
        aside={
          <p className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm text-ink-soft">
            <Clock className="size-5 shrink-0 text-saffron-ink" strokeWidth={1.6} aria-hidden="true" />
            <span>
              <span className="block font-semibold text-ink">{contact.hours}</span>
              Closed on Sundays and national holidays
            </span>
          </p>
        }
      />

      <section className="py-12 md:py-16">
        <div className="shell grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ContactForm />
          </Reveal>

          <div className="space-y-6 lg:col-span-5">
            <Stagger as="ul" className="grid gap-3" stagger={0.08}>
              {channels.map(({ icon: Icon, label, value, href }) => (
                <StaggerItem as="li" key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-saffron"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-saffron-soft text-saffron-ink transition-colors group-hover:bg-saffron group-hover:text-on-saffron">
                      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs text-muted">{label}</span>
                      <span className="block figure text-xl text-ink">{value}</span>
                    </span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.15} className="rounded-2xl bg-navy p-6 text-on-navy">
              <h2 className="eyebrow text-saffron!">Our offices</h2>
              <ul className="mt-5 divide-y divide-white/10">
                {offices.map((office) => (
                  <li key={office.city} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <MapPin className="mt-1 size-4 shrink-0 text-saffron" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">
                        {office.city} <span className="text-xs font-normal text-on-navy-muted">· {office.label}</span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-on-navy-muted">{office.address}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="rounded-2xl border border-line p-6 text-sm text-ink-soft">
              <h2 className="font-semibold text-ink">Grievance redressal</h2>
              <p className="mt-2 leading-relaxed">
                If an issue isn&apos;t resolved to your satisfaction, write to our Grievance Officer,{" "}
                {contact.grievance.name}, at{" "}
                <a href={`mailto:${contact.grievance.email}`} className="font-semibold text-ink underline decoration-saffron underline-offset-2">
                  {contact.grievance.email}
                </a>
                . We acknowledge within 2 working days.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
