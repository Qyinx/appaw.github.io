export const en = {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About Us',
    business: 'Business',
    styleGuide: 'Style Guide',
    language: 'Language',
  },

  // Home Page
  home: {
    hero: {
      title: 'Showcase Your Passion. Protect Your Investment.',
      subtitle: 'Your PSA 10 Gem Mint deserves better than a cheap plastic sleeve.',
      description: 'Upgrade to the PSA Card Aluminum Protector—where industrial-grade protection meets gallery-worthy display.',
      cta: 'Shop Now',
      learnMore: 'Learn More',
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
      description: 'Add to cart now and give your collection the armor it deserves!',
      button: 'Shop Now',
    },
  },

  // About Page
  about: {
    title: 'About Us',
    subtitle: 'Your Trusted Partner in Card Collection',
    story: {
      title: 'Our Story',
      content: 'Appaw Store was founded by passionate collectors who understand the importance of protecting valuable cards. We started with a simple mission: to provide the best card protection solutions and consignment services to fellow collectors.',
    },
    mission: {
      title: 'Our Mission',
      content: 'To be the most trusted name in card protection and consignment services, helping collectors preserve and grow their valuable collections.',
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
      },
    },
  },

  // Business Page
  business: {
    title: 'Our Business',
    subtitle: 'Premium Card Protection & Consignment Services',
    cardProtector: {
      title: 'PSA Card Aluminum Protector',
      description: 'Industrial-grade protection meets gallery-worthy display. Your PSA 10 Gem Mint deserves better.',
      features: [
        'Frame Material: Precision-cut Aluminum Alloy (Rigid & Impact Resistant)',
        'Lens Material: UV-Blocking Glass (High Clarity & Anti-Fade)',
        'Closure: Strong Magnetic Seal (N52 Magnets – No screws needed)',
        'Interior: Precision fit with soft buffer zone to prevent scratching',
        'Build: Heavy-duty, premium feel in the hand',
      ],
      compatibility: {
        fits: 'Standard 35PT PSA Graded Slabs (Pokemon, Sports, MTG)',
        notFits: 'Thick memorabilia/jersey cards, BGS or CGC slabs',
        note: 'Case only. PSA card not included.',
      },
      cta: 'Shop Now',
    },
    consignment: {
      title: 'Consignment Store',
      description: 'Let us sell your cards for you. We handle the listing, photography, and customer service.',
      features: [
        'Professional photography and listing',
        'Competitive commission rates',
        'Secure storage and handling',
        'Access to our customer network',
        'Hassle-free selling experience',
      ],
      cta: 'Learn More',
    },
    process: {
      title: 'How Consignment Works',
      steps: [
        {
          icon: 'package',
          title: 'Send Your Cards',
          description: 'Ship your graded cards to us securely.',
        },
        {
          icon: 'camera',
          title: 'We List Them',
          description: 'Professional photos and listings on multiple platforms.',
        },
        {
          icon: 'store',
          title: 'We Sell',
          description: 'We handle all customer inquiries and transactions.',
        },
        {
          icon: 'wallet',
          title: 'Get Paid',
          description: 'Receive payment once your card sells.',
        },
      ],
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
    description: 'Your trusted partner for card protection and consignment services.',
    quickLinks: 'Quick Links',
    contact: 'Contact',
    followUs: 'Follow Us',
    rights: 'All rights reserved.',
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
};

export type Translations = typeof en;
