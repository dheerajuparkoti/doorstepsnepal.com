
import { z } from "zod";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const getProfileSchema = (getLocalizedText: (en: string, ne: string) => string) =>
  z.object({
       full_name: z
      .string()
      .trim()
      .min(2, {
        message: getLocalizedText(
          "Full name must be at least 2 characters",
          "पूरा नाम कम्तीमा २ अक्षर हुनुपर्छ"
        ),
      })
      .max(40, {
        message: getLocalizedText(
          "Full name cannot exceed 40 characters",
          "पूरा नाम 30 अक्षर भन्दा बढी हुन सक्दैन"
        ),
      })
      .refine((val) => /^[A-Za-z ]+$/.test(val), {
        message: getLocalizedText(
          "Full name can only contain English letters and spaces",
          "पूरा नाममा केवल अंग्रेजी अक्षर र स्पेस मात्र हुन सक्छ"
        ),
      })
      .refine((val) => (val.match(/ /g) || []).length <= 3, {
        message: getLocalizedText(
          "Full name can have at most 3 spaces",
          "पूरा नाममा अधिकतम ३ स्पेस मात्र हुन सक्छ"
        ),
      }),

    email: z
    .string()
    .trim()
    .refine((val) => emailRegex.test(val), {
      message: getLocalizedText(
        "Please enter a valid email address",
        "कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्"
      ),
    }),
    phone_number: z
      .string()
      .trim()
      .min(7, { message: getLocalizedText("Phone number is too short", "फोन नम्बर छोटो छ") })
      .max(15, { message: getLocalizedText("Phone number is too long", "फोन नम्बर लामो छ") }),

    gender: z.enum(["male","female","other"], { 
      errorMap: () => ({ message: getLocalizedText("Please select a valid gender", "कृपया मान्य लिङ्ग चयन गर्नुहोस्") }) 
    }),

    age_group: z.enum(["age_18_24","age_25_34","age_35_44","age_45_54","age_55_64","age_65_plus"], {
      errorMap: () => ({ message: getLocalizedText("Please select a valid age group", "कृपया मान्य उमेर समूह चयन गर्नुहोस्") })
    }),

     bio: z
    .string()
    .trim()
    .max(500, {
      message: getLocalizedText(
        "Notes cannot exceed 500 characters",
        "नोटहरू ५०० अक्षर भन्दा बढी हुन सक्दैन"
      ),
    })
    .regex(/^[A-Za-z0-9 .,;:!?'"()\-@#&%$*\/\\\n\r]*$/, {
      message: getLocalizedText(
        "Notes can only contain English letters, numbers, and common symbols",
        "नोटहरूमा केवल अंग्रेजी अक्षर, नम्बर, र सामान्य प्रतीकहरू मात्र हुन सक्छ"
      ),
    }),



    notes: z
    .string()
    .trim()
    .max(500, {
      message: getLocalizedText(
        "Notes cannot exceed 500 characters",
        "नोटहरू ५०० अक्षर भन्दा बढी हुन सक्दैन"
      ),
    })
    .regex(/^[A-Za-z0-9 .,;:!?'"()\-@#&%$*\/\\\n\r]*$/, {
      message: getLocalizedText(
        "Notes can only contain English letters, numbers, and common symbols",
        "नोटहरूमा केवल अंग्रेजी अक्षर, नम्बर, र सामान्य प्रतीकहरू मात्र हुन सक्छ"
      ),
    }),



        ordernotes: z
    .string()
    .trim()
    .max(200, {
      message: getLocalizedText(
        "Notes cannot exceed 200 characters",
        "नोटहरू 2०० अक्षर भन्दा बढी हुन सक्दैन"
      ),
    })
    .regex(/^[A-Za-z0-9 .,;:!?'"()\-@#&%$*\/\\\n\r]*$/, {
      message: getLocalizedText(
        "Notes can only contain English letters, numbers, and common symbols",
        "नोटहरूमा केवल अंग्रेजी अक्षर, नम्बर, र सामान्य प्रतीकहरू मात्र हुन सक्छ"
      ),
    }),

    


     alphanumericField: z
    .string()
    .trim()
    .max(100, {
      message: getLocalizedText(
        "Field cannot exceed 100 characters",
        "क्षेत्र १०० अक्षर भन्दा बढी हुन सक्दैन"
      ),
    })
    .regex(/^[A-Za-z0-9 ]*$/, {
      message: getLocalizedText(
        "Field can only contain English letters, numbers, and spaces",
        "क्षेत्रमा केवल अंग्रेजी अक्षर, नम्बर, र स्पेस मात्र हुन सक्छ"
      ),
    }),



  });

export type ProfileSchemaType = z.infer<ReturnType<typeof getProfileSchema>>;