export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const heroVideo = {
  src: "hero-video.mp4",
  poster:
    "https://images.pexels.com/photos/7578554/pexels-photo-7578554.jpeg?auto=compress&cs=tinysrgb&w=1920",
  alt: "Healthcare professionals in a modern hospital environment",
} as const;

export const marketingImages = {
  hero: {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=900&fit=crop&q=80",
    alt: "Doctor consulting with a patient in a modern clinic",
    width: 1200,
    height: 900,
  },
  authAside: {
    src: "https://images.unsplash.com/photo-1631217868264-e5b1bb5e2abb?w=800&h=1000&fit=crop&q=80",
    alt: "Healthcare professionals collaborating in a hospital",
    width: 800,
    height: 1000,
  },
  about: {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop&q=80",
    alt: "Modern hospital corridor with natural light",
    width: 1200,
    height: 800,
  },
  contact: {
    src: "https://images.unsplash.com/photo-1586773866528-d19530b9d8de?w=800&h=600&fit=crop&q=80",
    alt: "Healthcare reception desk ready to assist patients",
    width: 800,
    height: 600,
  },
  services: {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=700&fit=crop&q=80",
    alt: "Medical team reviewing patient care options",
    width: 1200,
    height: 700,
  },
} as const satisfies Record<string, ContentImage>;

export const serviceImages = {
  video: {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop&q=80",
    alt: "Doctor on a video consultation call",
    width: 600,
    height: 400,
  },
  pharmacy: {
    src: "https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    alt: "Medicines and pharmacy products arranged for delivery",
    width: 600,
    height: 400,
  },
  lab: {
    src: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop&q=80",
    alt: "Lab technician preparing a diagnostic sample",
    width: 600,
    height: 400,
  },
  ambulance: {
    src: "https://images.pexels.com/photos/5364345/pexels-photo-5364345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    alt: "Emergency ambulance ready for dispatch",
    width: 600,
    height: 400,
  },
  records: {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&q=80",
    alt: "Doctor reviewing digital health records",
    width: 600,
    height: 400,
  },
  messaging: {
    src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop&q=80",
    alt: "Patient communicating securely with care team",
    width: 600,
    height: 400,
  },
} as const satisfies Record<string, ContentImage>;

export const testimonialAvatars = [
  {
    src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80",
    alt: "Portrait of Dr. Ayesha Rahman",
    width: 200,
    height: 200,
  },
  {
    src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80",
    alt: "Portrait of Karim Ahmed",
    width: 200,
    height: 200,
  },
  {
    src: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=80",
    alt: "Portrait of Nadia Chowdhury",
    width: 200,
    height: 200,
  },
] as const satisfies readonly ContentImage[];
