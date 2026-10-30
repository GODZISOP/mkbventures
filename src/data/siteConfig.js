import defaultLogo from '../images/mkb-logo.svg';

/**
 * =========================================================================
 * 🌟 GLOBAL SITE CONFIGURATION (CENTRAL CONTROL PANEL)
 * =========================================================================
 * Nayi website banane ke liye sirf is file mein data change karein!
 * Yahan badalne se puri website (Navbar, Footer, Contact, WhatsApp, About)
 * khud-ba-khud 1 second mein update ho jayegi.
 */

export const siteConfig = {
  // 🏢 Company Information
  companyName: "MKB Ventures Global LLC",
  shortName: "MKB Ventures",
  legalName: "MKB VENTURES GLOBAL LLC",
  tagline: "Home & Kitchen, Beauty Care & Pet Supplies",
  heroSubtitle: "Quality finds, easy shopping, and dependable service from MKB Ventures Global LLC.",
  eyebrowStandard: "THE MKB VENTURES STANDARD",

  // 📞 Phone, WhatsApp & Email
  phonePrimary: "(+966) 59 582 2656",       // Display phone on top nav
  phonePrimaryTel: "+966595822656",          // Dial link (tel:...)
  phoneDirect: "(+966) 59 582 2656",        // Direct trade desk line
  phoneDirectTel: "+966595822656",          // Direct dial link
  whatsappNumber: "966595822656",            // Numbers only (country code + number)
  whatsappDisplay: "(+966) 59 582 2656",
  email: "info@mkbventuresgloballlc.com",

  // 📍 Registered & Operating Address
  address: {
    line1: "30 N Gould St # 68445",
    line2: "Sheridan, WY 82801",
    full: "30 N Gould St # 68445 Sheridan, WY 82801",
    cityStateZip: "Sheridan, WY 82801",
    jurisdiction: "Wyoming LLC Registered"
  },

  // 🚚 Warehousing & Shipping Hubs
  hubs: {
    originText: "Dispatched via Sheridan, WY & Global Trade Hubs",
    dispatchNote: "Dispatched from our primary registered facilities at Sheridan, Wyoming (US domestic & North America) and our Middle East trade hub in KSA."
  },

  // 📖 About Page Description & Mission
  about: {
    mission: "Our mission is to bridge the gap between quality manufacturers and consumers worldwide across Automotive Essentials, Baby Care, Personal Care, Grocery, and Home Living.",
    b2bNote: "Whether you are an independent supermarket, a chain retailer, or an online merchant, our company provides flexible minimums, volume price tiers, and dependable fulfillment."
  },

  // ⭐ Testimonial Quote
  testimonial: {
    quote: "We placed a commercial order for Beauty and Baby Care products. Quality is exceptional, and their communication was 10/10.",
    author: "Verified Commercial Client"
  },

  // 💰 Currency Symbol used across the store (e.g. '₨', '$', 'SAR', 'AED')
  currencySymbol: "$",

  // 🖼️ Logo (Change path if you have a new logo in src/images/)
  logo: defaultLogo,

  // 🎨 Website Color Theme (Hex codes)
  // Har website ke liye yahan se color badlein:
  // Examples:
  // Emerald Green: primaryNavy: "#062c26", secondaryTeal: "#0d5c4d", accentTeal: "#059669", accentHover: "#047857"
  // Royal Blue:    primaryNavy: "#0f172a", secondaryTeal: "#1e3a8a", accentTeal: "#2563eb", accentHover: "#1d4ed8"
  // Luxury Gold:   primaryNavy: "#18181b", secondaryTeal: "#27272a", accentTeal: "#d97706", accentHover: "#b45309"
  theme: {
    primaryNavy: "#0c1a2e",
    secondaryTeal: "#134e5e",
    accentTeal: "#0d9488",
    accentHover: "#0f766e"
  }
};
