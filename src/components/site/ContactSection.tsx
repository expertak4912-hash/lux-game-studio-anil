import { useState } from "react";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "./SectionHeading";
import { WhatsAppButton } from "./WhatsAppButton";
import { Reveal } from "./Reveal";
import { submitContactMessage } from "@/lib/cms.functions";

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      await submitContactMessage({
        data: {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
        },
      });
      form.reset();
      toast.success("Message sent", {
        description: "Thanks for getting in touch — our team will reply by email shortly.",
      });
    } catch (error) {
      toast.error("Could not send your message", {
        description: (error as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-shell py-20 lg:py-28">
      <SectionHeading
        eyebrow="Contact"
        title="Talk to our support team"
        description="Send a message through the form or start a WhatsApp conversation. We only use the channels published on this website."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="glass-card rounded-3xl p-6 sm:p-8" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className="h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-12"
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="h-12"
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea id="contact-message" name="message" required rows={5} />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" variant="gold" size="xl" disabled={submitting}>
                {submitting ? "Sending…" : "Submit Message"}
              </Button>
              <WhatsAppButton label="WhatsApp Support" size="xl" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Only share information you are comfortable sending. See the Privacy Policy for how
              contact details are handled.
            </p>
          </form>
        </Reveal>

        <Reveal delay={120} className="grid gap-5">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold">Support channels</h3>
            <ul className="mt-5 grid gap-5 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
                  <MessageSquare className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">WhatsApp</span>
                  Fastest route to a member of the support team.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Contact form</span>
                  Best for detailed questions that need a written reply.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-foreground/5 text-foreground">
                  <Clock className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Response times</span>
                  Messages are answered in the order received during support hours.
                </span>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-accent">Need to slow down?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If gaming stops feeling like entertainment, our support team can talk you through
              limit and self-exclusion options, and point you to independent help in your region.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
