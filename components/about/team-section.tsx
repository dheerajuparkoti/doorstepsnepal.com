'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Mail, ExternalLink } from 'lucide-react';
interface SectionProps {
  id?: string;
}
export default function TeamSection({ id }: SectionProps) {
  const { t } = useI18n();

  const teamMembers = [
    {
      name: t.about.teamMember1Name,
      role: t.about.teamMember1Role,
      image: '/about/team-members/dheeraj.jpg',
      bio: t.about.teamMember1Bio,
      social: {
        facebook: 'https://www.facebook.com/reverse.minded.17',
        email: 'dheeraj.uparkoti.17@gmail.com',
      },
    },
    {
      name: t.about.teamMember2Name,
      role: t.about.teamMember2Role,
 image: '/about/team-members/dheeraj.jpg',
      bio: t.about.teamMember2Bio,
      social: {
         facebook: 'https://www.facebook.com/reverse.minded.17',
        email: 'dheeraj.uparkoti.17@gmail.com',
      },
    },
    {
      name: t.about.teamMember3Name,
      role: t.about.teamMember3Role,
 image: '/about/team-members/dheeraj.jpg',
      bio: t.about.teamMember3Bio,
      social: {
   facebook: 'https://www.facebook.com/reverse.minded.17',
        email: 'dheeraj.uparkoti.17@gmail.com',
      },
    },
    {
      name: t.about.teamMember4Name,
      role: t.about.teamMember4Role,
    image: '/about/team-members/dheeraj.jpg',
      bio: t.about.teamMember4Bio,
      social: {
   facebook: 'https://www.facebook.com/reverse.minded.17',
        email: 'dheeraj.uparkoti.17@gmail.com',
      },
    },
  ];

  // Helper to open Gmail Compose window
  const openGmail = (email: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <section id={id} className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.about.teamTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.about.teamSubtitle}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg group bg-card">
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
                
                {/* Social Links Row */}
                <div className="flex gap-4 border-t pt-4">
                  {/* Facebook Link */}
                  {member.social.facebook !== '#' ? (
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[#1877F2]"
                      title="Follow on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="text-[10px] font-bold uppercase">Profile</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground/30 cursor-not-allowed">
                      <Facebook className="h-5 w-5" />
                    </div>
                  )}

                  {/* Gmail Button */}
                  {member.social.email !== '#' && (
                    <button
                      onClick={() => openGmail(member.social.email)}
                      className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                      title="Open in Gmail"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-[10px] font-bold uppercase flex items-center gap-0.5">
                        Email <ExternalLink className="h-2 w-2" />
                      </span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}