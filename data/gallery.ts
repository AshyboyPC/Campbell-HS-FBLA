const networkingPhotoNumbers = [
  1745, 1747, 1753, 1754, 1755, 1756, 1757, 1758, 1760, 1761, 1762, 1764,
  1765, 1766, 1767, 1768, 1769, 1770, 1771, 1772, 1773, 1774, 1775, 1776,
  1779, 1780, 1781, 1783, 1784, 1785, 1787, 1788, 1789, 1790
];

const trunkOrTreatPhotoNumbers = [
  1048, 1049, 1050, 1051, 1053, 1065, 1104, 1136, 1137, 1166, 1167, 1216,
  1249, 1287, 1288, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 2291,
  2292, 2293, 2294, 2295, 2296
];

const convertedNetworkingPhotos = networkingPhotoNumbers.map((number) => ({
  id: `networking-${number}`,
  src: `/gallery-converted/networking/IMG_${number}.jpg`,
  alt: `Campbell FBLA networking guest speaker event — photo ${number}`,
  schoolYear: "2025–26",
  category: "Career",
  provenance: "Converted from the original local CR2 file in the public folder."
}));

const convertedTrunkOrTreatPhotos = trunkOrTreatPhotoNumbers.map((number) => ({
  id: `trunk-or-treat-${number}`,
  src: `/gallery-converted/trunk-or-treat/IMG_${number}.jpg`,
  alt: `Campbell FBLA Trunk or Treat — photo ${number}`,
  schoolYear: "2025–26",
  category: "Chapter life",
  provenance: number >= 2291
    ? "Converted from the original local HEIC file in the public folder."
    : "Converted from the original local CR2 file in the public folder."
}));

export const gallery = [
  {
    "id": "archive-1",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/2411d2cd-e694-4eaf-8fc2-424855ac92ca/SLC7.jpg",
    "alt": "Students by illuminated FBLA letters",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-2",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/33659004-bb0e-4a33-a076-b89b77a0febc/SLC10.jpg",
    "alt": "Group in front of FBLA backdrop",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-3",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/67ff674c-c627-4d01-b06f-7226f97bd55a/SLC3.jpg",
    "alt": "FBLA plush mascots",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-4",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/6ee40188-061b-4205-b4c5-cda9fad5b7dd/SLC8.jpg",
    "alt": "Students posing at SLC",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-5",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/7318ebd2-e5c5-4d63-ab61-fc304ad7c599/SLC6.jpg",
    "alt": "SLC formal group by FBLA letters",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-6",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/7e0f8568-1334-42c0-8054-258257e54e45/SLC9.jpg",
    "alt": "Group in front of Georgia FBLA backdrop",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-7",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/88651f09-65f7-4e18-baf9-36d7fe38abde/SLC11.JPG",
    "alt": "Neon Georgia FBLA sign",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-8",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/c3bffe2b-91ab-4ede-a8b6-f0b02904511c/SLC5.jpg",
    "alt": "Three students by FBLA letters",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-9",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/c615ee02-79e7-4a1c-98fa-d8bee75bfc7c/SLC1.jpg",
    "alt": "Conference hall audience and stage",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-10",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/eb471d55-5a07-471c-aeab-93d13e13c636/SLC.jpg",
    "alt": "Large auditorium at SLC",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing collection explicitly titled SLC 2025."
  },
  {
    "id": "archive-11",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/debcb7b2-53d0-486f-9c7b-eb8c18334a1d/Regional_winner_3.jpg",
    "alt": "Regional winner medal photo",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-12",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/39d93355-6e30-43b5-aab9-8205427ad196/Camie_-_MLK_Award.jpg",
    "alt": "Camie MLK Award",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-13",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/6c55ef8c-ef43-43fb-8c43-e5db6d7a5973/Tyler_MLK_Award.jpg",
    "alt": "Tyler MLK Award",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-14",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/e81e10ac-733a-464a-9e47-64ef25983200/IMG_0339.JPG",
    "alt": "Student with medal in hallway",
    "schoolYear": "2024–25",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-15",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/753ede79-dea5-404e-afa5-c5d8b9c06e9a/FLC2.JPG",
    "alt": "Speaker at podium during FLC",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-16",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/717db393-78c3-41e1-8384-b89dbf30caad/FLC3.jpg",
    "alt": "FLC group photo",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-17",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/f2203447-4110-46e7-8e62-2e9d0234e2f1/FLC_1.jpg",
    "alt": "GAFBLA stage with podium",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-18",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/fe71d8b7-3e82-4103-9741-36103cb605d4/FLC.jpg",
    "alt": "FLC formal group photo",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-19",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/0172d37d-d231-4823-9bf6-91c6c109d885/FBLA_Week_Table.jpg",
    "alt": "FBLA Week promotional table at Campbell HS",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-20",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/12a5a322-afea-42f7-973a-2e84fea65158/Food_Drive.jpg",
    "alt": "FBLA Food Drive donation boxes",
    "schoolYear": "2025–26",
    "category": "Service",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-21",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/1d64d741-81a3-431f-b664-48f41d5076fa/Feb_Social5.jpg",
    "alt": "February social students at table",
    "schoolYear": "2024–25",
    "category": "Social",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-22",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/23db7a04-f275-4c5e-964e-ebf93abf9248/Feb_Social_4.jpg",
    "alt": "February social smiles and snacks",
    "schoolYear": "2024–25",
    "category": "Social",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-23",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/2c04df90-a290-478f-bec0-8bc67949fbd5/Feb_Social_3.jpg",
    "alt": "Group around pink table during social",
    "schoolYear": "2024–25",
    "category": "Social",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-24",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/34f7a917-b928-4cbb-aba8-8023ad6f048c/Fall_Rally_Motivational_Speaker.jpg",
    "alt": "Fall Rally motivational speaker display",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-25",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/87ba3b21-d144-4816-9b25-aee9c309b5ba/Fab_Social_3.jpg",
    "alt": "February social classroom celebration",
    "schoolYear": "2024–25",
    "category": "Social",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-26",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/a95eafe3-fc34-4ac1-8ce0-41380b553c17/Fall_Rally_Group.JPG",
    "alt": "Fall Rally group outdoors",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-27",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/cd05c245-51b2-4df9-b714-262fb3f6e3cb/Fall_Rally.jpg",
    "alt": "Fall Rally swing ride",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-28",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/cd0c4108-1b26-464d-8e7c-4e0f111944c3/Feb_Social_1.jpg",
    "alt": "Student activity with pink tablecloths",
    "schoolYear": "2024–25",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-29",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/daabd847-0c7e-46db-ab12-681a53869677/FBLA_Shirts_-_Embrace_the_Challenge.JPG",
    "alt": "FBLA shirts - Embrace the Challenge",
    "schoolYear": "2024–25",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-30",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/e11934a0-ed61-4f17-83a7-4caf6cca4e09/Campbell-High-Student-Volunteer-IAS.JPG",
    "alt": "Campbell High student volunteer",
    "schoolYear": "2025–26",
    "category": "Service",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-31",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/e812751f-ca71-4a76-b42d-c37055f6af91/Feb_Social.jpg",
    "alt": "February social group at table",
    "schoolYear": "2024–25",
    "category": "Social",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-32",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/7041062f-ed82-4c03-a635-0fac2c19be0d/thumbnail_trick_or_treat_-_2.png",
    "alt": "Halloween Beetlejuice theme graphic",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "archive-33",
    "src": "https://storage.googleapis.com/cosmic-project-image-assets/images/163a33f7-7734-4632-a368-912df051e1b4/September_Challenge.JPG",
    "alt": "September Service Challenge thank you cards",
    "schoolYear": "2025–26",
    "category": "Service",
    "provenance": "Existing public website collection; archive grouping per September 2026 brief."
  },
  {
    "id": "public-chapter-meeting-2680",
    "src": "/Chapter Meeting Activities /IMG_2680.PNG",
    "alt": "Campbell FBLA chapter meeting activity",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Chapter Meeting Activities."
  },
  {
    "id": "public-chapter-meeting-2681",
    "src": "/Chapter Meeting Activities /IMG_2681.PNG",
    "alt": "Members working during a Campbell FBLA chapter meeting",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Chapter Meeting Activities."
  },
  {
    "id": "public-chapter-meeting-2682",
    "src": "/Chapter Meeting Activities /IMG_2682.PNG",
    "alt": "Campbell FBLA members at a chapter meeting",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Chapter Meeting Activities."
  },
  {
    "id": "public-chapter-meeting-2683",
    "src": "/Chapter Meeting Activities /IMG_2683.PNG",
    "alt": "Chapter meeting moment at Campbell FBLA",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Chapter Meeting Activities."
  },
  {
    "id": "public-fall-rally-1841186793666310660",
    "src": "/Fall Rally /1841186793666310660.jpg",
    "alt": "Campbell FBLA members at Fall Rally",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-2540052164108964844",
    "src": "/Fall Rally /2540052164108964844.jpg",
    "alt": "Campbell FBLA Fall Rally group moment",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-3252488510361114715",
    "src": "/Fall Rally /3252488510361114715.jpg",
    "alt": "Campbell FBLA members enjoying Fall Rally",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-3826503647626195902",
    "src": "/Fall Rally /3826503647626195902.jpg",
    "alt": "Campbell FBLA Fall Rally activity",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-436696692587927995",
    "src": "/Fall Rally /436696692587927995.jpg",
    "alt": "Campbell FBLA group at Fall Rally",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-5747870700602016666",
    "src": "/Fall Rally /5747870700602016666.jpg",
    "alt": "Campbell FBLA Fall Rally gathering",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-fall-rally-6891529261502063956",
    "src": "/Fall Rally /6891529261502063956.jpg",
    "alt": "Campbell FBLA members together at Fall Rally",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder: Fall Rally."
  },
  {
    "id": "public-img-2281",
    "src": "/IMG_2281.jpg",
    "alt": "Campbell FBLA chapter moment",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder."
  },
  {
    "id": "public-img-2287",
    "src": "/IMG_2287.jpg",
    "alt": "Campbell FBLA members together",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder."
  },
  {
    "id": "public-rlc-winners",
    "src": "/RLC Winners.jpg",
    "alt": "Campbell FBLA RLC winners",
    "schoolYear": "2025–26",
    "category": "Conferences",
    "provenance": "Local public folder."
  },
  {
    "id": "public-trunk-or-treat-1956",
    "src": "/Trunk or Treat /IMG_1956.JPG",
    "alt": "Campbell FBLA Trunk or Treat activity",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Trunk or Treat."
  },
  {
    "id": "public-trunk-or-treat-2096",
    "src": "/Trunk or Treat /IMG_2096.JPG",
    "alt": "Campbell FBLA members at Trunk or Treat",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Trunk or Treat."
  },
  {
    "id": "public-trunk-or-treat-2097",
    "src": "/Trunk or Treat /IMG_2097.JPG",
    "alt": "Campbell FBLA Trunk or Treat gathering",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Trunk or Treat."
  },
  {
    "id": "public-trunk-or-treat-2098",
    "src": "/Trunk or Treat /IMG_2098.JPG",
    "alt": "Campbell FBLA Trunk or Treat moment",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Trunk or Treat."
  },
  {
    "id": "public-trunk-or-treat-2099",
    "src": "/Trunk or Treat /IMG_2099.JPG",
    "alt": "Campbell FBLA members at a Trunk or Treat event",
    "schoolYear": "2025–26",
    "category": "Chapter life",
    "provenance": "Local public folder: Trunk or Treat."
  },
  ...convertedNetworkingPhotos,
  ...convertedTrunkOrTreatPhotos
];
