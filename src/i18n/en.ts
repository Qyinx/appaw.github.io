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
      shopUrl: 'https://appawstore.etsy.com/',
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
      shopUrl: 'https://appawstore.etsy.com/',
    },
  },

  // About Page
  about: {
    title: 'About Us',
    subtitle: 'Your Trusted Partner in Card Collection',
    story: {
      title: 'Our Story',
      content: 'Appaw Store was founded by passionate collectors who understand the value of protecting graded cards. We offer premium PSA Card Aluminum Protectors that combine industrial-grade protection with elegant display, plus Grid Store rental spaces for collectors to showcase and sell their items.',
    },
    mission: {
      title: 'Our Mission',
      content: 'To provide collectors with the best aluminum protection for their graded cards, and affordable retail spaces through our Grid Store for selling collectibles.',
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
      shopUrl: 'https://appawstore.etsy.com/',
    },
    consignment: {
      title: 'Grid Store',
      description: 'Rent a display grid space in our store to showcase and sell your products. Perfect for small businesses and collectors.',
      features: [
        'Prime retail location in Hong Kong',
        'Flexible rental periods',
        'No need to be present - we handle sales',
        'Access to our foot traffic and customers',
        'Affordable monthly rates',
      ],
      cta: 'Inquire Now',
    },
    process: {
      title: 'How Grid Store Works',
      steps: [
        {
          icon: 'package',
          title: 'Choose Your Grid',
          description: 'Select a grid space that fits your needs.',
        },
        {
          icon: 'camera',
          title: 'Set Up Display',
          description: 'Arrange your products in your rented space.',
        },
        {
          icon: 'store',
          title: 'We Sell For You',
          description: 'Our staff handles all customer transactions.',
        },
        {
          icon: 'wallet',
          title: 'Collect Earnings',
          description: 'Receive your sales revenue regularly.',
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
