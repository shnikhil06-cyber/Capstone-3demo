// Authentic Indian doctor portraits stored locally in public /doctors/
export const DOCTOR_IMAGE_MAP = {
  'balbir sharma': '/doctors/dr-balbir-sharma.jpg',
  'priya patel': '/doctors/dr-priya-patel.jpg',
  'vikramaditya singh': '/doctors/dr-vikramaditya-singh.jpg',
  'ananya gupta': '/doctors/dr-ananya-gupta.jpg',
  'rajesh verma': '/doctors/dr-rajesh-verma.jpg',
  'alok nath': '/doctors/dr-alok-nath.jpg',
};

export const FALLBACK_DOCTOR_IMAGES = [
  '/doctors/dr-balbir-sharma.jpg',
  '/doctors/dr-priya-patel.jpg',
  '/doctors/dr-vikramaditya-singh.jpg',
  '/doctors/dr-ananya-gupta.jpg',
  '/doctors/dr-rajesh-verma.jpg',
  '/doctors/dr-alok-nath.jpg',
];

export function getDoctorImage(doc, index = 0) {
  const name = (doc?.user?.name || doc?.name || '').toLowerCase();
  for (const [key, path] of Object.entries(DOCTOR_IMAGE_MAP)) {
    if (name.includes(key)) {
      return path;
    }
  }
  return FALLBACK_DOCTOR_IMAGES[index % FALLBACK_DOCTOR_IMAGES.length];
}
