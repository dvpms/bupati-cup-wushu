// Event configuration used across the app
export const EVENT = {
  brand: "Open Tournanment Bupati Cup",
  name: "Naga Mas Bupati Cup Kab. Tangerang 2025",
  // Target datetime for countdown (ISO 8601 with timezone)
  date: "2025-10-30T23:59:59+07:00",
  dateLabel: "11 Oktober 2025",
  location: "Gedung Graha Pemuda, Kab. Tangerang, Indonesia",
  contacts: {
    whatsapp: { name: "Zeni Kartika", number: "+62 895 1453 1972" },
    email: "info@wushuevent.com",
  },
  links: {
    // Place proposal.pdf under /public if available; otherwise this can be updated later
    proposal: "/proposal.pdf",
    social: {
      facebook: "https://facebook.com/",
      instagram: "https://www.instagram.com/wushunagamastangerang/",
      x: "https://x.com/",
    },
    // Convenience links
    get wa() {
      // Build wa.me link with sanitized phone number (remove spaces and plus)
      const phone = (EVENT.contacts.whatsapp.number || "").replace(/[^0-9]/g, "");
      return phone ? `https://wa.me/${phone}` : "#";
    },
    get mailto() {
      return `mailto:${EVENT.contacts.email}`;
    },
  },
  stats: {
    // Temporary placeholders until wired to Supabase
    kontingen: 150,
    atlet: 980,
  },
  assets: {
    poster: "/poster-potret.png", // place this file under /public
    logos: {
      cabang: "/logo-cabang.png",
      kabupaten: "/logo-kabupaten.png",
      pusat: "/logo-pusat.png",
    },
  },
};
