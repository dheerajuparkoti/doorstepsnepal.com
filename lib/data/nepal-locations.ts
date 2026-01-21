export interface Province {
  id: number;
  name: string;
  nameNe: string;
}

export interface District {
  id: number;
  provinceId: number;
  name: string;
  nameNe: string;
}

export interface Municipality {
  id: number;
  districtId: number;
  name: string;
  nameNe: string;
  type: "metropolitan" | "sub-metropolitan" | "municipality" | "rural-municipality";
}

export const provinces: Province[] = [
  { id: 1, name: "Koshi Province", nameNe: "कोशी प्रदेश" },
  { id: 2, name: "Madhesh Province", nameNe: "मधेश प्रदेश" },
  { id: 3, name: "Bagmati Province", nameNe: "बागमती प्रदेश" },
  { id: 4, name: "Gandaki Province", nameNe: "गण्डकी प्रदेश" },
  { id: 5, name: "Lumbini Province", nameNe: "लुम्बिनी प्रदेश" },
  { id: 6, name: "Karnali Province", nameNe: "कर्णाली प्रदेश" },
  { id: 7, name: "Sudurpashchim Province", nameNe: "सुदूरपश्चिम प्रदेश" },
];

export const districts: District[] = [
  // Koshi Province
  { id: 1, provinceId: 1, name: "Bhojpur", nameNe: "भोजपुर" },
  { id: 2, provinceId: 1, name: "Dhankuta", nameNe: "धनकुटा" },
  { id: 3, provinceId: 1, name: "Ilam", nameNe: "इलाम" },
  { id: 4, provinceId: 1, name: "Jhapa", nameNe: "झापा" },
  { id: 5, provinceId: 1, name: "Khotang", nameNe: "खोटाङ" },
  { id: 6, provinceId: 1, name: "Morang", nameNe: "मोरङ" },
  { id: 7, provinceId: 1, name: "Okhaldhunga", nameNe: "ओखलढुङ्गा" },
  { id: 8, provinceId: 1, name: "Panchthar", nameNe: "पाँचथर" },
  { id: 9, provinceId: 1, name: "Sankhuwasabha", nameNe: "संखुवासभा" },
  { id: 10, provinceId: 1, name: "Solukhumbu", nameNe: "सोलुखुम्बु" },
  { id: 11, provinceId: 1, name: "Sunsari", nameNe: "सुनसरी" },
  { id: 12, provinceId: 1, name: "Taplejung", nameNe: "ताप्लेजुङ" },
  { id: 13, provinceId: 1, name: "Terhathum", nameNe: "तेह्रथुम" },
  { id: 14, provinceId: 1, name: "Udayapur", nameNe: "उदयपुर" },
  // Madhesh Province
  { id: 15, provinceId: 2, name: "Bara", nameNe: "बारा" },
  { id: 16, provinceId: 2, name: "Dhanusha", nameNe: "धनुषा" },
  { id: 17, provinceId: 2, name: "Mahottari", nameNe: "महोत्तरी" },
  { id: 18, provinceId: 2, name: "Parsa", nameNe: "पर्सा" },
  { id: 19, provinceId: 2, name: "Rautahat", nameNe: "रौतहट" },
  { id: 20, provinceId: 2, name: "Saptari", nameNe: "सप्तरी" },
  { id: 21, provinceId: 2, name: "Sarlahi", nameNe: "सर्लाही" },
  { id: 22, provinceId: 2, name: "Siraha", nameNe: "सिराहा" },
  // Bagmati Province
  { id: 23, provinceId: 3, name: "Bhaktapur", nameNe: "भक्तपुर" },
  { id: 24, provinceId: 3, name: "Chitwan", nameNe: "चितवन" },
  { id: 25, provinceId: 3, name: "Dhading", nameNe: "धादिङ" },
  { id: 26, provinceId: 3, name: "Dolakha", nameNe: "दोलखा" },
  { id: 27, provinceId: 3, name: "Kathmandu", nameNe: "काठमाडौं" },
  { id: 28, provinceId: 3, name: "Kavrepalanchok", nameNe: "काभ्रेपलाञ्चोक" },
  { id: 29, provinceId: 3, name: "Lalitpur", nameNe: "ललितपुर" },
  { id: 30, provinceId: 3, name: "Makwanpur", nameNe: "मकवानपुर" },
  { id: 31, provinceId: 3, name: "Nuwakot", nameNe: "नुवाकोट" },
  { id: 32, provinceId: 3, name: "Ramechhap", nameNe: "रामेछाप" },
  { id: 33, provinceId: 3, name: "Rasuwa", nameNe: "रसुवा" },
  { id: 34, provinceId: 3, name: "Sindhuli", nameNe: "सिन्धुली" },
  { id: 35, provinceId: 3, name: "Sindhupalchok", nameNe: "सिन्धुपाल्चोक" },
  // Gandaki Province
  { id: 36, provinceId: 4, name: "Baglung", nameNe: "बाग्लुङ" },
  { id: 37, provinceId: 4, name: "Gorkha", nameNe: "गोरखा" },
  { id: 38, provinceId: 4, name: "Kaski", nameNe: "कास्की" },
  { id: 39, provinceId: 4, name: "Lamjung", nameNe: "लमजुङ" },
  { id: 40, provinceId: 4, name: "Manang", nameNe: "मनाङ" },
  { id: 41, provinceId: 4, name: "Mustang", nameNe: "मुस्ताङ" },
  { id: 42, provinceId: 4, name: "Myagdi", nameNe: "म्याग्दी" },
  { id: 43, provinceId: 4, name: "Nawalpur", nameNe: "नवलपुर" },
  { id: 44, provinceId: 4, name: "Parbat", nameNe: "पर्वत" },
  { id: 45, provinceId: 4, name: "Syangja", nameNe: "स्याङ्जा" },
  { id: 46, provinceId: 4, name: "Tanahun", nameNe: "तनहुँ" },
  // Lumbini Province
  { id: 47, provinceId: 5, name: "Arghakhanchi", nameNe: "अर्घाखाँची" },
  { id: 48, provinceId: 5, name: "Banke", nameNe: "बाँके" },
  { id: 49, provinceId: 5, name: "Bardiya", nameNe: "बर्दिया" },
  { id: 50, provinceId: 5, name: "Dang", nameNe: "दाङ" },
  { id: 51, provinceId: 5, name: "Gulmi", nameNe: "गुल्मी" },
  { id: 52, provinceId: 5, name: "Kapilvastu", nameNe: "कपिलवस्तु" },
  { id: 53, provinceId: 5, name: "Nawalparasi West", nameNe: "नवलपरासी (पश्चिम)" },
  { id: 54, provinceId: 5, name: "Palpa", nameNe: "पाल्पा" },
  { id: 55, provinceId: 5, name: "Pyuthan", nameNe: "प्युठान" },
  { id: 56, provinceId: 5, name: "Rolpa", nameNe: "रोल्पा" },
  { id: 57, provinceId: 5, name: "Rupandehi", nameNe: "रुपन्देही" },
  // Karnali Province
  { id: 58, provinceId: 6, name: "Dailekh", nameNe: "दैलेख" },
  { id: 59, provinceId: 6, name: "Dolpa", nameNe: "डोल्पा" },
  { id: 60, provinceId: 6, name: "Humla", nameNe: "हुम्ला" },
  { id: 61, provinceId: 6, name: "Jajarkot", nameNe: "जाजरकोट" },
  { id: 62, provinceId: 6, name: "Jumla", nameNe: "जुम्ला" },
  { id: 63, provinceId: 6, name: "Kalikot", nameNe: "कालिकोट" },
  { id: 64, provinceId: 6, name: "Mugu", nameNe: "मुगु" },
  { id: 65, provinceId: 6, name: "Rukum West", nameNe: "रुकुम (पश्चिम)" },
  { id: 66, provinceId: 6, name: "Salyan", nameNe: "सल्यान" },
  { id: 67, provinceId: 6, name: "Surkhet", nameNe: "सुर्खेत" },
  // Sudurpashchim Province
  { id: 68, provinceId: 7, name: "Achham", nameNe: "अछाम" },
  { id: 69, provinceId: 7, name: "Baitadi", nameNe: "बैतडी" },
  { id: 70, provinceId: 7, name: "Bajhang", nameNe: "बझाङ" },
  { id: 71, provinceId: 7, name: "Bajura", nameNe: "बाजुरा" },
  { id: 72, provinceId: 7, name: "Dadeldhura", nameNe: "डडेलधुरा" },
  { id: 73, provinceId: 7, name: "Darchula", nameNe: "दार्चुला" },
  { id: 74, provinceId: 7, name: "Doti", nameNe: "डोटी" },
  { id: 75, provinceId: 7, name: "Kailali", nameNe: "कैलाली" },
  { id: 76, provinceId: 7, name: "Kanchanpur", nameNe: "कञ्चनपुर" },
];

export const municipalities: Municipality[] = [
  // Kathmandu District
  { id: 1, districtId: 27, name: "Kathmandu Metropolitan City", nameNe: "काठमाडौं महानगरपालिका", type: "metropolitan" },
  { id: 2, districtId: 27, name: "Kirtipur Municipality", nameNe: "कीर्तिपुर नगरपालिका", type: "municipality" },
  { id: 3, districtId: 27, name: "Budhanilkantha Municipality", nameNe: "बुढानिलकण्ठ नगरपालिका", type: "municipality" },
  { id: 4, districtId: 27, name: "Tokha Municipality", nameNe: "टोखा नगरपालिका", type: "municipality" },
  { id: 5, districtId: 27, name: "Tarakeshwor Municipality", nameNe: "तारकेश्वर नगरपालिका", type: "municipality" },
  { id: 6, districtId: 27, name: "Chandragiri Municipality", nameNe: "चन्द्रागिरी नगरपालिका", type: "municipality" },
  { id: 7, districtId: 27, name: "Nagarjun Municipality", nameNe: "नागार्जुन नगरपालिका", type: "municipality" },
  { id: 8, districtId: 27, name: "Kageshwori Manahara Municipality", nameNe: "कागेश्वरी मनहरा नगरपालिका", type: "municipality" },
  { id: 9, districtId: 27, name: "Dakshinkali Municipality", nameNe: "दक्षिणकाली नगरपालिका", type: "municipality" },
  { id: 10, districtId: 27, name: "Gokarneshwor Municipality", nameNe: "गोकर्णेश्वर नगरपालिका", type: "municipality" },
  { id: 11, districtId: 27, name: "Shankharapur Municipality", nameNe: "शंखरापुर नगरपालिका", type: "municipality" },
  // Lalitpur District
  { id: 12, districtId: 29, name: "Lalitpur Metropolitan City", nameNe: "ललितपुर महानगरपालिका", type: "metropolitan" },
  { id: 13, districtId: 29, name: "Godawari Municipality", nameNe: "गोदावरी नगरपालिका", type: "municipality" },
  { id: 14, districtId: 29, name: "Mahalaxmi Municipality", nameNe: "महालक्ष्मी नगरपालिका", type: "municipality" },
  // Bhaktapur District
  { id: 15, districtId: 23, name: "Bhaktapur Municipality", nameNe: "भक्तपुर नगरपालिका", type: "municipality" },
  { id: 16, districtId: 23, name: "Madhyapur Thimi Municipality", nameNe: "मध्यपुर थिमी नगरपालिका", type: "municipality" },
  { id: 17, districtId: 23, name: "Suryabinayak Municipality", nameNe: "सूर्यविनायक नगरपालिका", type: "municipality" },
  { id: 18, districtId: 23, name: "Changunarayan Municipality", nameNe: "चाँगुनारायण नगरपालिका", type: "municipality" },
  // Kaski District
  { id: 19, districtId: 38, name: "Pokhara Metropolitan City", nameNe: "पोखरा महानगरपालिका", type: "metropolitan" },
  // Morang District
  { id: 20, districtId: 6, name: "Biratnagar Metropolitan City", nameNe: "विराटनगर महानगरपालिका", type: "metropolitan" },
  // Rupandehi District
  { id: 21, districtId: 57, name: "Butwal Sub-Metropolitan City", nameNe: "बुटवल उप-महानगरपालिका", type: "sub-metropolitan" },
  { id: 22, districtId: 57, name: "Siddharthanagar Municipality", nameNe: "सिद्धार्थनगर नगरपालिका", type: "municipality" },
  // Chitwan District
  { id: 23, districtId: 24, name: "Bharatpur Metropolitan City", nameNe: "भरतपुर महानगरपालिका", type: "metropolitan" },
];

export function getDistrictsByProvince(provinceId: number): District[] {
  return districts.filter((d) => d.provinceId === provinceId);
}

export function getMunicipalitiesByDistrict(districtId: number): Municipality[] {
  return municipalities.filter((m) => m.districtId === districtId);
}

// Combined export for easier access with nameNp field aliases
export const nepalLocations = {
  provinces: provinces.map((p) => ({
    ...p,
    nameNp: p.nameNe,
    districts: districts
      .filter((d) => d.provinceId === p.id)
      .map((d) => ({
        ...d,
        nameNp: d.nameNe,
        municipalities: municipalities
          .filter((m) => m.districtId === d.id)
          .map((m) => ({ ...m, nameNp: m.nameNe })),
      })),
  })),
};
