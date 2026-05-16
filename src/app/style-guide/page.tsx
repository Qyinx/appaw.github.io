'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { ArrowRight, Shield, Star, Heart } from 'lucide-react';

export default function StyleGuidePage() {
  const { t } = useLanguage();

  const primaryColors = [
    { name: '50', value: '#f6f3fb', className: 'bg-primary-50' },
    { name: '100', value: '#efe9f8', className: 'bg-primary-100' },
    { name: '200', value: '#e3d6f1', className: 'bg-primary-200' },
    { name: '300', value: '#d1bfe6', className: 'bg-primary-300' },
    { name: '400', value: '#b79ad8', className: 'bg-primary-400' },
    { name: '500', value: '#9B7EBF', className: 'bg-primary-500' },
    { name: '600', value: '#8567a8', className: 'bg-primary-600' },
    { name: '700', value: '#6e4f86', className: 'bg-primary-700' },
    { name: '800', value: '#553a63', className: 'bg-primary-800' },
    { name: '900', value: '#3b2844', className: 'bg-primary-900' },
  ];

  const secondaryColors = [
    { name: '50', value: '#f0fbff', className: 'bg-secondary-50' },
    { name: '100', value: '#e6f8ff', className: 'bg-secondary-100' },
    { name: '200', value: '#cfeeff', className: 'bg-secondary-200' },
    { name: '300', value: '#9fe6ff', className: 'bg-secondary-300' },
    { name: '400', value: '#6fd0ff', className: 'bg-secondary-400' },
    { name: '500', value: '#6FC3FF', className: 'bg-secondary-500' },
    { name: '600', value: '#4aa8e6', className: 'bg-secondary-600' },
    { name: '700', value: '#2f83b3', className: 'bg-secondary-700' },
    { name: '800', value: '#235f80', className: 'bg-secondary-800' },
    { name: '900', value: '#18394d', className: 'bg-secondary-900' },
  ];

  const accentColors = [
    { name: '50', value: '#fff8f2', className: 'bg-accent-50' },
    { name: '100', value: '#fff0e6', className: 'bg-accent-100' },
    { name: '200', value: '#ffe0c9', className: 'bg-accent-200' },
    { name: '300', value: '#ffd0a6', className: 'bg-accent-300' },
    { name: '400', value: '#ffc07a', className: 'bg-accent-400' },
    { name: '500', value: '#F59E0B', className: 'bg-accent-500' },
    { name: '600', value: '#d68606', className: 'bg-accent-600' },
    { name: '700', value: '#a86a05', className: 'bg-accent-700' },
    { name: '800', value: '#7b4c04', className: 'bg-accent-800' },
    { name: '900', value: '#502f02', className: 'bg-accent-900' },
  ];

  const neutralColors = [
    { name: 'bg', value: '#0B0C0D', className: 'bg-neutral-900' },
    { name: 'panel', value: '#111214', className: 'bg-neutral-800' },
    { name: 'surface', value: '#1E1E2E', className: 'bg-neutral-700' },
    { name: 'muted', value: '#9CA3AF', className: 'bg-neutral-500' },
    { name: 'text', value: '#FFFFFF', className: 'bg-neutral-50' },
    { name: 'border', value: 'rgba(255,255,255,0.06)', className: 'bg-neutral-border' },
    { name: 'success', value: '#10B981', className: 'bg-neutral-success' },
    { name: 'warning', value: '#F59E0B', className: 'bg-neutral-warning' },
    { name: 'danger', value: '#EF4444', className: 'bg-neutral-danger' },
  ];

  const ColorSwatch = ({ colors, title }: { colors: typeof primaryColors; title: string }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">{title}</h3>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {colors.map((color) => (
          <div key={color.name} className="text-center">
            <div
              style={{ backgroundColor: color.value }}
              className={`w-full aspect-square rounded-lg shadow-sm border`} 
            />
            <div className="mt-1 text-xs text-neutral-600">{color.name}</div>
            <div className="text-[10px] text-neutral-400">{color.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-primary-50" />
        <div className="relative container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Design System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 mb-4">
            {t.styleGuide.title}
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-4">
            {t.styleGuide.subtitle}
          </p>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Built with Next.js 15, Tailwind CSS v4, and modern animations. Featuring glassmorphism, 3D effects, and smooth transitions.
          </p>
        </div>
      </section>

      {/* Colors Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
            {t.styleGuide.sections.colors}
          </h2>
          
          <div className="space-y-8">
            <ColorSwatch colors={primaryColors} title={t.styleGuide.colorCategories.primary} />
            <ColorSwatch colors={secondaryColors} title={t.styleGuide.colorCategories.secondary} />
            <ColorSwatch colors={accentColors} title={t.styleGuide.colorCategories.accent} />
            <ColorSwatch colors={neutralColors} title={t.styleGuide.colorCategories.neutral} />
          </div>

          {/* Gradient examples */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Gradients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 rounded-xl bg-gradient-to-r from-[#9B7EBF] to-[#AF97D3] flex items-center justify-center text-white font-medium">
                Primary Gradient
              </div>
              <div className="h-24 rounded-xl bg-gradient-to-r from-[#6FC3FF] to-[#4AA8E6] flex items-center justify-center text-white font-medium">
                Secondary Gradient
              </div>
              <div className="h-24 rounded-xl bg-gradient-to-r from-[#9B7EBF] to-[#6FC3FF] flex items-center justify-center text-white font-medium">
                Brand Gradient
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8 flex items-center gap-3">
            <span className="text-3xl">Aa</span>
            {t.styleGuide.sections.typography}
          </h2>

          <div className="grid gap-8">
            {/* Font families */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Font Families</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Display Font (Poppins)</div>
                    <div className="font-display text-3xl font-bold">The quick brown fox jumps over the lazy dog</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Body Font (Inter)</div>
                    <div className="font-sans text-lg">The quick brown fox jumps over the lazy dog</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Heading styles */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Headings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-neutral-400">H1 - text-5xl/6xl/7xl</span>
                    <h1 className="text-5xl font-bold font-display text-neutral-900">Heading One</h1>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">H2 - text-3xl/4xl</span>
                    <h2 className="text-3xl font-bold font-display text-neutral-900">Heading Two</h2>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">H3 - text-xl/2xl</span>
                    <h3 className="text-xl font-bold font-display text-neutral-900">Heading Three</h3>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">H4 - text-lg</span>
                    <h4 className="text-lg font-bold text-neutral-900">Heading Four</h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Body text */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Body Text</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-neutral-400">Large - text-lg</span>
                    <p className="text-lg text-neutral-600">Large body text for important content and introductions.</p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">Regular - text-base</span>
                    <p className="text-base text-neutral-600">Regular body text for most content. This is the default size used throughout the website.</p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">Small - text-sm</span>
                    <p className="text-sm text-neutral-600">Small text for captions, labels, and secondary information.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-500 rounded-lg" />
            {t.styleGuide.sections.buttons}
          </h2>

          <div className="grid gap-8">
            {/* Button variants */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different button styles for various purposes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </CardContent>
            </Card>

            {/* Button sizes */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>Available button sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </CardContent>
            </Card>

            {/* Buttons with icons */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Buttons with Icons</CardTitle>
                <CardDescription>Buttons can include icons for better visual communication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <ArrowRight className="mr-2 w-4 h-4" />
                    With Left Icon
                  </Button>
                  <Button>
                    With Right Icon
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button variant="secondary">
                    <Shield className="mr-2 w-4 h-4" />
                    Protection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-white rounded-lg shadow-lg" />
            {t.styleGuide.sections.cards}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Cards are used to group related content and actions. They have a subtle shadow and hover effect.
                </p>
              </CardContent>
            </Card>

            {/* Card with icon */}
            <Card className="text-center">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Feature Card</h3>
                <p className="text-neutral-600 text-sm">
                  Perfect for showcasing features or services with an icon.
                </p>
              </CardContent>
            </Card>

            {/* Card without hover */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Static Card</CardTitle>
                <CardDescription>Without hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  Use hover=false for cards that don&apos;t need interaction feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8 flex items-center gap-3">
            <span className="w-10 h-10 border-2 border-dashed border-primary-500 rounded-lg" />
            {t.styleGuide.sections.spacing}
          </h2>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>Tailwind CSS default spacing scale (in rem/px)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: '1', value: '0.25rem (4px)', width: 'w-1' },
                  { name: '2', value: '0.5rem (8px)', width: 'w-2' },
                  { name: '4', value: '1rem (16px)', width: 'w-4' },
                  { name: '6', value: '1.5rem (24px)', width: 'w-6' },
                  { name: '8', value: '2rem (32px)', width: 'w-8' },
                  { name: '12', value: '3rem (48px)', width: 'w-12' },
                  { name: '16', value: '4rem (64px)', width: 'w-16' },
                ].map((space) => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div className={`${space.width} h-4 bg-primary-500 rounded`} />
                    <span className="text-sm text-neutral-600 w-8">{space.name}</span>
                    <span className="text-sm text-neutral-400">{space.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Icons Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-8">
            Icons (Lucide React)
          </h2>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Icon Examples</CardTitle>
              <CardDescription>We use Lucide React for icons throughout the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {[
                  { Icon: Shield, name: 'Shield' },
                  { Icon: Star, name: 'Star' },
                  { Icon: Heart, name: 'Heart' },
                  { Icon: ArrowRight, name: 'ArrowRight' },
                ].map(({ Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-neutral-700" />
                    </div>
                    <span className="text-xs text-neutral-500">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
