import React from 'react';
import { useI18n } from '@/lib/i18n/context';

export function InformationSection() {
  const { language } = useI18n();

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  const infoItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: getLocalizedText('Minimum Withdrawal', 'न्यूनतम निकासी'),
      description: getLocalizedText(
        'Withdrawals require a minimum balance of Rs. 1,000. Once eligible, funds can be withdrawn to your preferred payment method.',
        'निकासीको लागि न्यूनतम ब्यालेन्स रु. १,००० आवश्यक छ। एक पटक योग्य भएपछि, रकम तपाईंको मनपर्ने भुक्तानी विधिमा निकाल्न सकिन्छ।'
      ),
      color: 'primary'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: getLocalizedText('Processing Time', 'प्रशोधन समय'),
      description: getLocalizedText(
        'Withdrawal requests are processed within 3-5 business days. You will receive a notification once the transfer is completed.',
        'निकासी अनुरोधहरू ३-५ कार्य दिनभित्र प्रशोधन गरिन्छ। स्थानान्तरण पूरा भएपछि तपाईंलाई सूचना प्राप्त हुनेछ।'
      ),
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: getLocalizedText('Secure Payments', 'सुरक्षित भुक्तानी'),
      description: getLocalizedText(
        'All transactions are secured and monitored. Your payment information is encrypted and never shared with third parties.',
        'सबै कारोबार सुरक्षित र निगरानी गरिएको छ। तपाईंको भुक्तानी जानकारी एन्क्रिप्ट गरिएको छ र तेस्रो पक्षसँग कहिल्यै साझेदारी गरिदैन।'
      ),
      color: 'green'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: getLocalizedText('Commission Reports', 'कमिसन रिपोर्ट'),
      description: getLocalizedText(
        'Detailed commission reports are generated automatically. Download PDF reports for your records anytime.',
        'विस्तृत कमिसन रिपोर्टहरू स्वचालित रूपमा उत्पन्न हुन्छन्। तपाईंको रेकर्डको लागि कुनै पनि समय PDF रिपोर्टहरू डाउनलोड गर्नुहोस्।'
      ),
      color: 'purple'
    }
  ];

  const proTips = [
    getLocalizedText(
      'Keep your payment methods updated for faster withdrawals',
      'छिटो निकासीको लागि आफ्नो भुक्तानी विधिहरू अद्यावधिक राख्नुहोस्'
    ),
    getLocalizedText(
      'Download commission reports monthly for tax purposes',
      'कर उद्देश्यका लागि मासिक कमिसन रिपोर्टहरू डाउनलोड गर्नुहोस्'
    ),
    getLocalizedText(
      'Contact support within 24 hours if you notice any discrepancies',
      'कुनै विसंगति देखेमा २४ घण्टाभित्र समर्थनमा सम्पर्क गर्नुहोस्'
    )
  ];

  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      border: 'border-primary-200 dark:border-primary-800',
      iconBg: 'bg-primary-100 dark:bg-primary-900/40'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/40'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40'
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 px-1">
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-foreground">
          {getLocalizedText('Important Information', 'महत्त्वपूर्ण जानकारी')}
        </h2>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => {
          const colors = colorClasses[item.color as keyof typeof colorClasses];
          
          return (
            <div
              key={index}
              className={`
                p-5 rounded-xl border ${colors.border} ${colors.bg}
                transition-all hover:shadow-md
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`
                  p-2.5 rounded-lg ${colors.iconBg} ${colors.text}
                  flex-shrink-0
                `}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${colors.text} mb-1`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Tips Card */}
      <div className="mt-4 p-5 bg-gradient-to-r from-muted/50 to-muted dark:from-muted/20 dark:to-muted/10 rounded-xl border border-border">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-muted-foreground/10 rounded-lg">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">
              {getLocalizedText('Pro Tips', 'विशेष सुझाव')}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {proTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Support Link */}
      <div className="text-center pt-2">
        <a
          href="/support"
          className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary/80 font-medium"
        >
          <span>{getLocalizedText('Need help? Visit Support Center', 'मद्दत चाहियो? सहायता केन्द्रमा जानुहोस्')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}