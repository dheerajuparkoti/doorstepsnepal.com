"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n/context";
import { Star, ThumbsUp, MessageSquare, Calendar } from "lucide-react";

const reviewStats = {
  overall: 4.8,
  total: 156,
  breakdown: [
    { stars: 5, count: 120, percent: 77 },
    { stars: 4, count: 25, percent: 16 },
    { stars: 3, count: 8, percent: 5 },
    { stars: 2, count: 2, percent: 1 },
    { stars: 1, count: 1, percent: 1 },
  ],
};

const reviews = [
  {
    id: "1",
    customer: {
      name: "Bikram Shrestha",
      nameNp: "बिक्रम श्रेष्ठ",
      photo: "/placeholder.svg?height=60&width=60",
    },
    rating: 5,
    date: "2024-01-20",
    service: "Plumbing Repair",
    serviceNp: "प्लम्बिङ मर्मत",
    comment:
      "Excellent work! Ram ji arrived on time and fixed our leaking pipe quickly. Very professional and clean work. Highly recommended!",
    commentNp:
      "उत्कृष्ट काम! राम जी समयमै आउनुभयो र हाम्रो चुहिएको पाइप छिट्टै ठीक गर्नुभयो। धेरै व्यावसायिक र सफा काम। अत्यधिक सिफारिस गरिएको!",
    helpful: 12,
    replied: true,
    reply:
      "Thank you for your kind words! It was a pleasure serving you. Looking forward to helping you again.",
  },
  {
    id: "2",
    customer: {
      name: "Sunita Maharjan",
      nameNp: "सुनिता महर्जन",
      photo: "/placeholder.svg?height=60&width=60",
    },
    rating: 5,
    date: "2024-01-18",
    service: "Tap Installation",
    serviceNp: "ट्याप स्थापना",
    comment:
      "Great service! The new tap looks perfect and works smoothly. Very satisfied with the installation quality.",
    commentNp:
      "राम्रो सेवा! नयाँ ट्याप एकदम राम्रो देखिन्छ र सुचारु रूपमा काम गर्छ। स्थापना गुणस्तरबाट धेरै सन्तुष्ट।",
    helpful: 8,
    replied: false,
  },
  {
    id: "3",
    customer: {
      name: "Rajesh Tamang",
      nameNp: "राजेश तामाङ",
      photo: "/placeholder.svg?height=60&width=60",
    },
    rating: 4,
    date: "2024-01-15",
    service: "Maintenance",
    serviceNp: "मर्मत",
    comment:
      "Good service overall. Thorough inspection and maintenance. Arrived a bit late but communicated well about the delay.",
    commentNp:
      "समग्रमा राम्रो सेवा। पूर्ण निरीक्षण र मर्मत। अलि ढिलो आउनुभयो तर ढिलाइको बारेमा राम्रोसँग जानकारी दिनुभयो।",
    helpful: 5,
    replied: true,
    reply:
      "Thank you for your feedback! I apologize for the delay. I'll make sure to manage my time better. Your satisfaction is important to me.",
  },
];

export default function ReviewsPage() {
  const { t, locale } = useI18n();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("myReviews")}</h1>
        <p className="text-muted-foreground">{t("customerFeedback")}</p>
      </div>

      {/* Rating Overview */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="text-center md:border-r md:pr-8">
              <div className="text-5xl font-bold text-foreground mb-2">
                {reviewStats.overall}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(reviewStats.overall)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {reviewStats.total} {t("totalReviews")}
              </p>
            </div>

            <div className="flex-1 space-y-3">
              {reviewStats.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{item.stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={item.percent} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={review.customer.photo || "/placeholder.svg"}
                    alt={review.customer.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {locale === "ne"
                          ? review.customer.nameNp
                          : review.customer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === "ne" ? review.serviceNp : review.service}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-foreground mb-4">
                {locale === "ne" ? review.commentNp : review.comment}
              </p>

              {review.replied && review.reply && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4 ml-4 border-l-2 border-primary">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {t("yourReply")}:
                  </p>
                  <p className="text-sm text-muted-foreground">{review.reply}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {review.helpful} {t("helpful")}
                </button>
                {!review.replied && (
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <MessageSquare className="w-4 h-4" />
                    {t("reply")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
