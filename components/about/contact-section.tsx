
'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface SectionProps {
  id?: string;
}
export default function ContactSection({ id }: SectionProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send');
      }

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error: Could not send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t.about.contactEmail,
      // Array for multiple emails
      value: ['info@doorstepsnepal.com', 'support@doorstepsnepal.com'],
    },
    {
      icon: Phone,
      title: t.about.contactPhone,
      value: ['+977-9851407706','+977-9851407707','+977-9768943001'],
    },
    {
      icon: MapPin,
      title: t.about.contactAddress,
      value: 'Kathmandu, Nepal',
    },
  ];

  return (
    <section id={id} className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.about.contactTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.about.contactSubtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        {/* Logic to handle array (emails) vs string (phone/address) */}
                        {Array.isArray(info.value) ? (
                          info.value.map((item, idx) => (
                            <a 
                              key={idx} 
                              href={`mailto:${item}`} 
                              className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                            >
                              {item}
                            </a>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <Card className="h-full border-none shadow-xl overflow-hidden">
              <CardContent className="p-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="mb-4 rounded-full bg-green-100 p-4 text-green-600">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold">Message Sent Successfully!</h3>
                    <p className="mt-2 text-muted-foreground max-w-xs">
                      Thank you for reaching out. Our team at Doorsteps Nepal will contact you shortly.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6" 
                      onClick={() => setIsSuccess(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t.about.formName}</label>
                        <Input
                          placeholder={t.about.formNamePlaceholder}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t.about.formEmail}</label>
                        <Input
                          type="email"
                          placeholder={t.about.formEmailPlaceholder}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t.about.formMessage}</label>
                      <Textarea
                        placeholder={t.about.formMessagePlaceholder}
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isSubmitting}
                        required
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto min-w-[150px] gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t.about.formSubmit}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}