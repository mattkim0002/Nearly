import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Camera, Hammer, Paintbrush, Layers, Sofa } from "lucide-react";
import Link from "next/link";

const crafts = [
  { icon: Camera, label: "Photography" },
  { icon: Hammer, label: "Woodworking" },
  { icon: Layers, label: "Ceramics" },
  { icon: Paintbrush, label: "Illustration" },
  { icon: Sofa, label: "Interior Design" },
];

const reasons = [
  {
    title: "Clients who mean it",
    description:
      "People on Nearly come with a real project in mind. They're not browsing for fun — they're looking for the right person to work with.",
  },
  {
    title: "Your craft, your terms",
    description:
      "List exactly what you offer at the price you set. No race to the bottom, no algorithm pushing you to discount.",
  },
  {
    title: "Direct connections",
    description:
      "Inquiries go straight to your inbox. You decide who to work with and how. Nearly gets out of the way.",
  },
];

export default function BecomeAProPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-muted/40 border-b border-border py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
              For Pros
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Turn your craft into clients
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Nearly is a marketplace for skilled creative professionals. List
              your services, get discovered by people with real projects, and
              build your local clientele.
            </p>
            <Link
              href="#"
              className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Apply to join — it's free
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Sign-up coming soon. Leave your details and we'll reach out.
            </p>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-20 space-y-24">

          {/* Who it's for */}
          <section className="text-center">
            <h2 className="text-2xl font-black tracking-tight mb-2">
              Who is a Nearly Pro?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10">
              Nearly is for skilled craftspeople who produce real, tangible
              work — not generic freelancers. If you work with your hands or
              your eye, you belong here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {crafts.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-6">
              More categories coming soon.
            </p>
          </section>

          {/* Why Nearly */}
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-10 text-center">
              Why list on Nearly?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="border border-border rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center border border-border rounded-2xl py-16 px-6">
            <h2 className="text-3xl font-black tracking-tight mb-3">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Pro sign-up is launching soon. In the meantime, let us know
              you're interested and we'll be in touch.
            </p>
            <Link
              href="/#"
              className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Join the waitlist
            </Link>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
