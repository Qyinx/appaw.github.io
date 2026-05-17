import { start } from "repl";

export const en = {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About Us',
    business: 'Business',
    psaProtector: 'PSA Protector',
    collection: 'My Collection',
    cardTrading: 'Card Trading',
    products: 'Products',
    styleGuide: 'Style Guide',
    language: 'Language',
  },

  // Home Page
  home: {
    hero: {
      badge: 'Premium Card Protection',
      title: 'Showcase Your Passion. Protect Your Investment.',
      subtitle: 'Premium card protection & trusted TCG trading — all in one place.',
      description: 'From our signature aluminum protectors to our professional card brokerage, we help collectors protect and grow their collections.',
      cta: 'Shop Now',
      shopUrl: 'https://appawstore.etsy.com/',
      learnMore: 'Browse Cards',
      trustIndicators: {
        uvProtection: 'UV Protection',
        n52Magnets: 'N52 Magnets',
        antiFadeGlass: 'Anti-Fade Glass',
      },
    },
    features: {
      title: 'Why Collectors Switch to Aluminum',
      subtitle: 'We designed this for the serious collector who wants to enjoy their cards without risking damage.',
      quality: {
        title: 'True Drop Protection',
        description: 'Unlike acrylic cases that can crack upon impact, our aluminum frame acts as a rigid bumper, absorbing shock and keeping your slab safe.',
      },
      trust: {
        title: 'UV Defense',
        description: 'Preserves the vibrant colors of your chrome, holo, and vintage cards by blocking harmful light.',
      },
      support: {
        title: 'The "Click" of Quality',
        description: 'Experience the satisfying snap of the magnetic closure. It creates a secure, dust-proof seal while allowing for easy access.',
      },
    },
    cta: {
      title: 'Ready to Upgrade Your Display?',
      description: 'Whether you want to protect your collection or trade graded cards, we\'ve got you covered.',
      button: 'Shop Now',
      shopUrl: 'https://appawstore.etsy.com/',
    },
    services: {
      badge: 'Our Services',
      title: 'Two Ways We Serve Collectors',
      subtitle: 'From premium protection to trusted trading, we\'ve got your collection covered.',
      protector: {
        subtitle: 'Industrial-grade aluminum protection meets gallery-worthy display for your prized PSA graded cards.',
        cta: 'View Product',
      },
      trading: {
        subtitle: 'A trusted marketplace for buying, selling, and brokering premium graded trading cards.',
        cta: 'Start Trading',
      },
    },
    tradingPreview: {
      badge: 'Trading Desk',
      title: 'Browse Our Card Inventory',
      description: 'Explore our curated selection of professionally graded trading cards, from Pokémon to sports cards and MTG.',
      features: [
        'PSA & CGC graded cards available',
        'Competitive pricing with full transparency',
        'Consignment & brokerage services',
        'Secure transactions with buyer protection',
      ],
      cta: 'Browse Marketplace',
    },
  },

  // About Page
  about: {
    title: 'About Us',
    subtitle: 'Your Trusted Partner in Card Collection',
    story: {
      title: 'Our Story',
      content: 'Founded in 2024 by a team of passionate collectors in Hong Kong, Appaw Store grew out of a simple frustration: the acrylic cases on the market for PSA graded cards just weren\'t good enough. They cracked on impact, offered no UV protection, and looked cheap on the shelf. So we built our own. Our PSA Card Aluminum Protector combines CNC-precision aluminum alloy, UV-blocking glass, and N52 magnetic closure — giving serious collectors industrial-grade protection with gallery-worthy display. Alongside the protector, we operate a trusted face-to-face TCG brokerage and consignment service in Hong Kong, connecting buyers and sellers of PSA and CGC graded Pokémon, sports, and MTG cards with full transparency and no upfront fees.',
      founderName: 'Appaw Store',
      founderRole: 'Founded 2024 · Hong Kong',
    },
    mission: {
      title: 'Our Mission',
      content: 'To provide collectors with the best aluminum protection for their graded cards, and a trusted marketplace for buying and selling premium trading cards.',
    },
    values: {
      title: 'Our Values',
      quality: {
        title: 'Quality First',
        description: 'We never compromise on the quality of our products and services.',
      },
      integrity: {
        title: 'Integrity',
        description: 'Honest and transparent dealings with all our customers.',
      },
      passion: {
        title: 'Passion',
        description: 'We share your love for collecting and treat your cards like our own.',
      },
      service: {
        title: 'Service Excellence',
        description: 'Dedicated to providing exceptional customer experience.',
      },
    },
    trust: {
      title: 'We Love What We Do',
      description: 'Every card we protect and every transaction we handle is done with the same care and attention as if it were our own collection.',
      stats: {
        cardsProtected: 'Cards Protected',
        happyCustomers: 'Happy Customers',
        satisfaction: 'Satisfaction',
        yearsOfCraft: 'Years of Craft',
        andCounting: 'And counting',
        worldwide: 'Worldwide',
        customerVerified: 'Customer verified',
        ofExcellence: 'Of excellence',
      },
    },
  },

  // Business Page
  business: {
    title: 'Our Business',
    subtitle: 'Premium Card Protection & TCG Trading',
    cardProtector: {
      title: 'PSA Card Aluminum Protector',
      description: 'Industrial-grade protection meets gallery-worthy display. Your valuable collection deserves better.',
      startingPrice: 'Recommended Price',
      shippingInfo: 'Worldwide shipping',
      features: [
        'Frame Material: Precision-cut Aluminum Alloy (Rigid & Impact Resistant)',
        'Lens Material: UV-Blocking Glass (High Clarity & Anti-Fade)',
        'Closure: Strong Magnetic Seal (N52 Magnets – No screws needed)',
        'Interior: Precision fit with soft buffer zone to prevent scratching',
        'Build: Heavy-duty, premium feel in the hand',
      ],
      compatibility: {
        fits: 'Standard 35PT PSA Graded Slabs (Pokemon, Sports, MTG), CGC Slabs Compatible',
        notFits: 'Thick memorabilia/jersey cards, BGS or TAG slabs',
        note: 'Case only. PSA card not included.',
      },
      cta: 'Shop Now',
      shopUrl: 'https://appawstore.etsy.com/',
    },
    cardTrading: {
      title: 'TCG Trading & Brokerage',
      description: 'A trusted marketplace for buying, selling, and brokering premium graded trading cards. Whether you\'re looking to acquire a grail or liquidate a collection, we handle the process with transparency and expertise.',
      badge: 'Trading Desk',
      features: [
        'Buy & sell PSA/CGC graded Pokémon, sports, and MTG cards',
        'Consignment sales — we sell on your behalf for competitive commission',
        'Professional price appraisal based on real-time market data',
        'Secure transactions with full buyer/seller protection',
      ],
      cta: 'Start Trading',
      stats: {
        cardsTraded: 'Cards Traded',
        avgRating: 'Avg. Rating',
        repeatClients: 'Repeat Clients',
      },
    },
    cta: {
      title: 'Ready to Get Started?',
      description: "Whether you want to protect your collection with our premium aluminum cases or trade graded cards through our brokerage service, we're here to help.",
      whatsapp: 'WhatsApp Us',
      email: 'Email Us',
    },
  },

  // PSA Protector Page (dedicated)
  psaProtectorPage: {
    badge: 'Premium Protection',
    featuresTitle: 'Product Features',
    featuresSubtitle: 'Click on each feature to see the details',
    compatibilityTitle: 'Compatibility',
    compatibilitySubtitle: 'Make sure your cards fit perfectly',
    compatible: 'Compatible',
    notCompatible: 'Not Compatible',
    note: 'Note',
    techBadge: 'Technical Details',
    techTitle: 'Technical Specifications',
    techSubtitle: 'Premium materials and precise engineering for ultimate protection',
    specs: {
      size: 'Size',
      sizeDesc: 'Width × Length × Height',
      weight: 'Weight',
      weightDesc: 'Lightweight & portable',
      materials: 'Materials',
      materialsValue: 'Aluminum & Glass',
      materialsDesc: 'Premium quality build',
      uvProtection: 'UV Protection',
      uvProtectionDesc: 'Blocks harmful UV rays',
    },
    colorVariants: {
      badge: 'Color Options',
      title: 'Choose Your Style',
      subtitle: 'Available in a curated palette of premium finishes to match your personal aesthetic',
      pickColor: 'Select a Finish',
      note: 'Colors shown are representative. Actual product color may vary slightly due to screen settings and manufacturing.',
      colors: {
        blueDarkGrey: 'Storm',
        silver: 'Champagne',
        gold: 'Prestige Gold',
        roseTintedBlue: 'Aurora',
        navy: 'Purple',
        forestGreen: 'Forest Green',
        goldenEmberRed: 'Ember',
        dark: 'Midnight',
      },
    },
    ctaTitle: 'Ready to Protect Your Collection?',
    ctaSubtitle: 'Give your prized cards the premium protection they deserve',
    faq: {
      badge: 'FAQs',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know before you order',
      items: [
        {
          q: 'Does it fit all PSA graded slabs?',
          a: 'The protector fits standard 35PT PSA graded slabs — Pokémon, sports cards, and MTG. It does NOT fit thick PSA memorabilia/jersey cards, half-pound slabs, BGS slabs, or CGC slabs.',
        },
        {
          q: 'How does the magnetic closure work?',
          a: 'N52 neodymium magnets — the strongest grade commercially available — snap the case shut without any screws, tools, or latches. Firm enough for display and transport, yet easy to open by hand.',
        },
        {
          q: 'What level of UV protection does the glass provide?',
          a: 'The glass lens blocks greater than 95% of ultraviolet light, preventing the UV-induced colour fading that affects chrome, holographic, and vintage cards over time.',
        },
        {
          q: 'Will the magnets damage my card?',
          a: 'No. The N52 magnets are embedded in the aluminum frame and do not make contact with the PSA slab or the card inside. The magnetic field at slab distance is safe for all trading cards.',
        },
        {
          q: 'What are the exact dimensions and weight?',
          a: '8.7 cm wide × 14.2 cm tall × 0.98 cm deep, weight 74 g. Made from precision-machined aluminum with a UV-blocking glass lens.',
        },
        {
          q: 'Where can I buy it and does it ship internationally?',
          a: 'Order via our Etsy shop (appawstore.etsy.com), Carousell Hong Kong, or directly through WhatsApp at +852-9285-1189. Worldwide shipping to the USA, UK, HK, SG, and TW.',
        },
      ],
    },
  },

  // Card Trading Guide & FAQ
  tradingGuide: {
    badge: 'Acquisition & Consignment',
    title: 'Acquire & Consign',
    subtitle: 'Our high-touch acquisition and consignment process — designed for serious collectors and alternative asset investors.',
    buyTab: 'Buying',
    sellTab: 'Selling',
    buy: {
      title: 'How to Acquire a Card',
      rules: [
        {
          heading: 'Message Us on WhatsApp',
          body: 'Send us the card name and your offer price via WhatsApp at +852-9285-1189. We will confirm availability and agree on a final price with you.',
        },
        {
          heading: 'Complete Payment',
          body: 'Pay via Cash, FPS, or Wise (HKD settlement). For in-person meetups in Hong Kong, payment is made at handover. For international orders, payment is required before shipping.',
        },
        {
          heading: 'Receive Your Card',
          body: 'For Hong Kong meetups, collect your card on the spot. For international orders, we ship via DAP (Delivered At Place) — shipping costs and import duties are borne by the buyer.',
        },
      ],
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'Where can we meet for a card transaction in Hong Kong?',
            a: 'We prefer meetups at Quarry Bay, Causeway Bay, Central, or Mong Kok East. Other locations across Hong Kong are available upon discussion. WhatsApp us at +852-9285-1189 to arrange a convenient spot and time.',
          },
          {
            q: 'What payment methods do you accept when buying graded cards?',
            a: 'We accept Cash, FPS (Faster Payment System), and Wise (HKD settlement) at the time of handover. We do not accept credit cards, bank transfers, or instalment payments.',
          },
          {
            q: 'Can someone else collect the card on my behalf?',
            a: 'No. The payer and recipient must be the same person. Third-party pickups are not accepted under any circumstances.',
          },
          {
            q: 'Do you offer postal delivery for card purchases or consignments?',
            a: 'Yes — we now accept global shipping via DAP (Delivered At Place). Shipping costs and any import duties are borne by the buyer. For high-value cards, face-to-face meetup in Hong Kong is strongly recommended for added security.',
          },
        ],
      },
    },
    sell: {
      title: 'How to Consign an Asset',
      rules: [
        {
          heading: 'Face-to-Face or International Shipping',
          body: 'Cards can be delivered to us in person (preferred for high-value items) or shipped internationally. DAP (Delivered At Place) terms apply — shipping costs are borne by the consignor.',
        },
        {
          heading: 'Commission on Sale Only',
          body: 'No upfront listing fee. Commission is only charged once your card has been successfully sold.',
        },
        {
          heading: 'Quarterly Stocktake',
          body: 'Every 3 months we contact you to confirm whether you wish to continue listing. If we receive no response within 2 months of that notice, ownership of the card is considered transferred to Appaw Store.',
        },
        {
          heading: 'Update Your Price Anytime',
          body: 'You can request a price change at any time. Updates are reflected within 48 hours — or sooner if a buyer has already expressed interest.',
        },
        {
          heading: 'Authenticity Check',
          body: 'All submitted cards undergo an authenticity inspection. We reserve the right to decline cards where authenticity cannot be confirmed.',
        },
      ],
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'What grading companies do you accept for card consignment?',
            a: 'We currently accept PSA, BGS, and TAG graded cards for consignment. Other grading companies may be considered on a case-by-case basis.',
          },
          {
            q: 'How is the card consignment commission rate determined?',
            a: 'Commission is tiered by final sale price: Under HK$1,000 → 7% (minimum HK$50) | HK$1,000–1,999 → 6% | HK$2,000–9,999 → 5.25% | HK$10,000–49,999 → 4.5% | HK$50,000 and above → 4.25%. Commission is charged on the final sale price only — no upfront fees.',
          },
          {
            q: 'Can I get my unsold consigned card back?',
            a: 'Yes — you may request your card back at any time after it has been listed for 14 days. We can arrange a face-to-face handback in Hong Kong, or return it via delivery — shipping costs are borne by the card owner.',
          },
          {
            q: 'What happens if my card fails the authenticity check?',
            a: 'We will notify you immediately and return the card at the next meetup. No fees are charged for declined submissions.',
          },
          {
            q: 'Can I change the listing price after submitting my card?',
            a: 'Yes. You can request a price update at any time. Changes go live within 48 hours — or sooner if a buyer has already expressed interest.',
          },
        ],
      },
    },
  },

  // Card Trading Marketplace
  cardMarketplace: {
    badge: 'Curated Gallery',
    title: 'Blue-Chip Card Gallery',
    subtitle: 'A curated gallery of investment-grade graded cards — authenticated, preserved, and available for private acquisition.',
    hero: {
      statsAvailable: 'Cards in stock',
      statsPsa: 'PSA graded',
      statsHkLabel: 'HK Only',
      statsHk: 'Face-to-face verified',
      explore: 'Explore',
      linkProtectors: 'PSA Protectors',
      linkBuyingGuide: 'Buying Guide',
      linkConsign: 'Consign a Card',
    },
    searchPlaceholder: 'Search by card name...',
    filters: {
      allCompanies: 'All',
      allGrades: 'All Grades',
      gradeRanges: {
        gem: 'Gem Mint (10)',
        high: 'High Grade (8–9.5)',
        mid: 'Mid Grade (5–7.5)',
        low: 'Entry (< 5)',
      },
    },
    card: {
      year: 'Year',
      grade: 'Grade',
      company: 'Grading Co.',
      set: 'Set',
      number: 'Card Number',
      cert: 'Cert #',
      language: 'Language',
      price: 'Listed Price',
      inquire: 'Inquire to Acquire',
      viewDetails: 'View Details',
      sold: 'Price Realized',
      soldOut: 'Price Realized',
      soldDescription: 'This asset has been acquired. Contact us about similar cards or to join our private acquisition list.',
      askSimilar: 'Inquire About Similar Assets',
      similarItems: 'Browse Similar Items',
    },
    modal: {
      details: 'Card Details',
      description: 'Description',
      close: 'Close',
      front: 'Front',
      back: 'Back',
    },
    bundle: {
      fullSet: 'Set',
      cards: 'Cards',
      cardsInSet: 'Cards in This Set',
      setOnly: 'Sold as set only',
      setPrice: 'Set Price',
    },
    grades: {
      blackLabel: 'Black Label',
      gemMint: 'Gem Mint',
      mint: 'Mint',
      nearMint: 'NM–MT',
      excellent: 'Excellent',
    },
    emptyState: {
      title: 'No Cards Found',
      description: 'Try adjusting your filters or search to find what you\'re looking for.',
      reset: 'Reset Filters',
    },
    resultsCount: 'assets in gallery',
    sortBy: 'Sort by',
    sortOptions: {
      newest: 'Newest Listed',
      gradeHigh: 'Grade: High to Low',
      gradeLow: 'Grade: Low to High',
      priceHigh: 'Price: High to Low',
      priceLow: 'Price: Low to High',
      nameAZ: 'Name: A–Z',
    },
    ctaBanner: {
      title: 'Private Acquisition Requests',
      description: 'Looking for a specific grail card or investment-grade asset? We source high-value cards not listed in the gallery — contact us privately.',
      button: 'Inquire Privately',
    },
    whyAppaw: {
      badge: 'Why Appaw Store',
      title: 'Investment-Grade Standards.',
      titleAccent: 'Not Just a Marketplace.',
      subtitle: 'We apply museum-grade and institutional-level standards to every acquisition and consignment — because your assets deserve it.',
      pillars: [
        {
          title: 'Museum-Grade Protection',
          body: 'Every acquisition from Appaw Store is compatible with our precision-milled aluminum protectors — industrial-grade enclosures with >95% UV-blocking glass and N52 neodymium closure.',
          linkText: 'View Protectors',
        },
        {
          title: 'Face-to-Face Verified',
          body: 'All Hong Kong transactions are completed in person at agreed locations. No anonymous drop-offs — every card is physically inspected at handover by both parties.',
          linkText: null,
        },
        {
          title: 'Zero-Fee Consignment',
          body: 'No listing fees, no upfront costs. Commission is charged only on successful sale. Tiered rates from 4.25% for high-value assets — the lowest structure for serious consignors.',
          linkText: 'See Commission Rates',
        },
        {
          title: 'Investment-Grade Provenance',
          body: 'We accept only PSA, BGS, and TAG certified assets. Every listing includes the certification number for independent verification before acquisition.',
          linkText: null,
        },
      ],
    },
    detail: {
      backToMarketplace: 'Back to Marketplace',
      shareLink: 'Share Link',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied!',
      viewPage: 'View full page',
    },
  },

  // Style Guide Page
  styleGuide: {
    title: 'Design Style Guide',
    subtitle: 'Visual design system for Appaw Store',
    sections: {
      colors: 'Color Palette',
      typography: 'Typography',
      buttons: 'Buttons',
      cards: 'Cards',
      spacing: 'Spacing',
    },
    colorCategories: {
      primary: 'Primary Colors',
      secondary: 'Secondary Colors',
      accent: 'Accent Colors',
      neutral: 'Neutral Colors',
    },
  },

  // Footer
  footer: {
    description: 'Your trusted partner for card protection and TCG trading.',
    quickLinks: 'Quick Links',
    contact: 'Contact',
    followUs: 'Follow Us',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
  },

  // Cookie Consent
  cookieConsent: {
    title: 'Cookie Notice',
    message: 'We use cookies and analytics to improve your experience and understand how you use our site. By clicking "Accept", you agree to our use of cookies and analytics services.',
    accept: 'Accept',
    decline: 'Decline',
  },

  // Graded Cards Page
  gradedCards: {
    badge: 'Premium Collection',
    title: 'Graded Cards Collection',
    subtitle: 'Browse our curated selection of professionally graded Pokémon cards',
    searchPlaceholder: 'Search cards...',
    filter: 'Filter',
    viewDetails: 'Details',
    comingSoon: 'More Cards Coming Soon!',
    comingSoonDesc: 'We\'re constantly updating our collection. Check back soon for new additions.',
  },

  // Retail Partners
  retailPartners: {
    badge: 'Where to Buy',
    title: 'Purchase Channels',
    subtitle: 'Choose your preferred way to shop',
    buyNow: 'Shop Now',
    orVisit: 'or visit our retail partners',
    visitStore: 'Visit Store',
    partners: {
      appawstore: {
        name: 'Appaw Store',
        description: 'Direct from manufacturer',
      },
      cardtheland: {
        name: 'Cardtheland',
        description: 'TCG specialty store',
        location: 'Unit G1B, 3/F, Kaiser Estate, Phase 2, Hung Hom',
      },
    },
    directDesc: 'Direct from manufacturer',
    retailHint: 'Visit our authorized partners for personal service',
    note: 'Interested in becoming a retail partner? Contact us!',
    onlineTitle: 'Online Store',
    retailTitle: 'Retail Partners',
    types: {
      online: 'Online',
      retail: 'Retail',
    },
    tags: {
      authorized: 'Store',
      official: 'Online Shop',
      inStock: 'In Stock',
    },
  },

  // Shop options dropdown
  shopOptions: {
    buyOnEtsy: 'Buy on Etsy',
    buyOnEtsyDesc: 'International · Ships worldwide',
    buyOnCarousell: 'Buy on Carousell',
    buyOnCarousellDesc: 'Hong Kong · Best for local buyers',
    orderWhatsApp: 'Order via WhatsApp',
    orderWhatsAppDesc: 'Direct order · Fastest response',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
  },
  collection: {
    title: 'My Collection',
    description: 'Manage your graded card collection, create portfolios, and track your inventory.',
    openCollection: 'Open Collection',
    signIn: 'Sign In',
    learnAboutSignIn: 'Learn more about signing in',
    features: [
      { title: 'Organise', body: 'Create portfolios and organise your cards for quick access.' },
      { title: 'Track Value', body: 'Monitor buy prices and see the estimated value of your collection.' },
      { title: 'Protect', body: 'Store and manage graded cards safely with detailed grading info.' },
    ],
    cta: {
      prompt: 'Ready to manage your collection?',
      buttonSignIn: 'Sign in to get started',
    },
    dropdown: {
      stored: 'Stored',
      portfolios: 'Portfolios',
      upgrade: 'Upgrade',
      upgradeDesc: 'Upgrade to increase limits and unlock advanced features.',
      planFree: 'Free plan',
      planSuffix: 'plan',
    },
    toolbar: {
      addCard: 'Add Card',
      addFirstCard: 'Add First Card',
      pickCardsToAdd: 'Pick Cards to Add',
      addCards: 'Add Cards',
      remove: 'Remove',
      close: 'Close',
    },
    searchPlaceholder: 'Search by name, set, cert no…',
    filters: {
      all: 'All Cards',
      active: 'Active Only',
      sold: 'Sold Only',
    },
    stats: {
      total: 'Total',
      active: 'Active',
      sold: 'Sold',
      buyHKD: 'Buy (HKD)',
    },
    portfolio: {
      title: 'Portfolios',
      newPortfolio: 'New Portfolio',
      public: 'Public',
      namePlaceholder: 'Portfolio name…',
      addTo: 'Add cards to "{name}"',
      available: '{n} available',
      new: 'New',
      makePublic: 'Make this portfolio public',
      create: 'Create Portfolio',
      creating: 'Creating…',
    },
    empty: {
      noCardsFound: 'No cards found',
      portfolioEmpty: '"{name}" is empty',
      noCardsYet: 'No cards yet',
      tryDifferentSearch: 'Try a different search term',
      addCardsUsingButton: 'Add cards using the button above',
      addYourFirstCard: 'Add your first card to get started',
    },
    table: {
      card: 'Card',
      grade: 'Grade',
      buyPrice: 'Buy Price',
      status: 'Status',
      actions: 'Actions',
      list: 'List',
    },
    account: {
      signOut: 'Sign out',
      refresh: 'Refresh',
      rename: 'Rename',
      delete: 'Delete',
      edit: 'Edit',
    },
    actions: {
      confirmDeleteCard: 'Delete this card?',
      confirm: 'Confirm',
    },
    form: {
      editTitle: 'Edit Card',
      addTitle: 'Add New Card',
      basicInfo: 'Basic Info',
      pricing: 'Pricing',
      photosTitle: 'Card Photos',
      photosSubtitle: 'Front & back photos stored with this card',
      photos: 'Photos',
      name: 'Card Name',
      namePlaceholder: 'e.g. Charizard VMAX',
      year: 'Year',
      buyPrice: 'Buy Price',
      buyPriceOptional: 'Buy Price (optional)',
      listPrice: 'List / Sell Price',
      certNumber: 'Cert / Slab Number',
      markAsSold: 'Mark as Sold',
      scan: {
        title: 'Auto-fill from grading label',
        subtitle: 'Scan the PSA / BGS / CGC label to fill fields automatically',
        scanButton: 'Scan Label',
        analysing: 'Analysing grading label…',
        doneMsg: 'Fields auto-filled — please review before saving.',
        tryAgain: 'Try Again',
        rescan: 'Rescan',
        scanFailed: 'Scan failed. Please fill in manually.',
      },
      saving: 'Saving…',
      updateCard: 'Update Card',
      addCard: 'Add Card',
      fixFollowing: 'Please fix the following:',
      errors: {
        nameRequired: 'Card name is required',
        buyPriceInvalid: 'Buy price must be a valid number',
        yearInvalid: 'Valid year is required',
        gradeInvalid: 'Valid grade is required',
      },
      grading: 'Grading',
      setName: 'Set Name',
      cardNumber: 'Card Number',
      language: 'Language',
      grade: 'Grade',
      front: 'Front',
      back: 'Back',
      addPrefix: 'Add',
      blackLabel: 'Black Label',
    },
  },
};

export type Translations = typeof en;
