import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Search, Send, Star, UserCircle, ListChecks, Inbox } from "lucide-react";
import Link from "next/link";

const clientSteps = [
  {
    icon: Search,
    title: "Search for what you need",
    description:
      "Browse by category or describe your project in the search bar. Nearly surfaces skilled local Pros — photographers, woodworkers, ceramicists, illustrators, interior designers, and more.",
  },
  {
    icon: Star,
    title: "Find the right Pro",
    description:
      "Browse Pro profiles, view their work, and check their listed services. Every Pro on Nearly is a real craftsperson with specific skills — not a generic freelancer.",
  },
  {
    icon: Send,
    title: "Send an inquiry",
    description:
      "Reach out directly through the Pro's profile. Tell them about your project — what you need, your timeline, and any specifics. No middlemen, no back-and-forth forms.",
  },
];

const proSteps = [
  {
    icon: UserCircle,
    title: "Claim your profile",
    description:
      "Sign up and build your Pro profile. Add your craft, location, and a short bio. Your profile is your storefront — make it yours.",
  },
  {
    icon: ListChecks,
    title: "List your services",
    description:
      "Add the specific things you offer — a custom chair, a ceramic set, a photo shoot, an illustration. Set your own pricing and describe what clients can expect.",
  },
  {
    icon: Inbox,
    title: "Receive and respond to inquiries",
    description:
      "When a client is interested, you'll get notified by email. Review their project, respond directly, and take it from there. No platform fees on early connections.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-muted/40 border-b border-border py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              How Nearly works
            </h1>
            <p className="text-muted-foreground text-lg">
              Nearly connects people who have a project with skilled local
              professionals who can bring it to life. Here's how it works for
              both sides.
            </p>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-20 space-y-24">

          {/* For Clients */}
          <section>
            <div className="mb-10">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                For Clients
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Find the right Pro for your project
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Whether you're a cafe owner wanting custom ceramics, someone
                redesigning their interior, or a musician needing album art —
                Nearly helps you find a trusted local Pro.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {clientSteps.map((step, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Step {i + 1}
                    </p>
                    <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/search"
                className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Find a Service
              </Link>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* For Pros */}
          <section>
            <div className="mb-10">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                For Pros
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Reach clients who value your craft
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Nearly is built for skilled creatives — not gig workers. List
                what you make and what you do, and let the right clients come
                to you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {proSteps.map((step, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Step {i + 1}
                    </p>
                    <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/become-a-pro"
                className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Become a Pro
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
