## Design System: POSIM

### Pattern
- **Name:** Event/Conference Landing
- **Conversion Focus:** Early bird pricing with deadline. Social proof (past attendees). Speaker credibility. Multi-ticket discounts.
- **CTA Placement:** Register CTA sticky + After speakers + Bottom
- **Color Strategy:** Urgency colors (countdown). Event branding. Speaker cards professional. Sponsor logos neutral.
- **Sections:** 1. Hero (date/location/countdown), 2. Speakers grid, 3. Agenda/schedule, 4. Sponsors, 5. Register CTA

### Style
- **Name:** Social Proof-Focused
- **Keywords:** Testimonials prominent, client logos displayed, case studies sections, reviews/ratings, user avatars, success metrics, credibility markers
- **Best For:** B2B SaaS, professional services, premium products, e-commerce conversion pages, established brands
- **Performance:** ⚡ Good | **Accessibility:** ✓ WCAG AA

### Colors
| Role | Hex |
|------|-----|
| Primary | #0EA5E9 |
| Secondary | #38BDF8 |
| CTA | #F97316 |
| Background | #F0F9FF |
| Text | #0C4A6E |

*Notes: Sky blue trust + warm CTA*

### Typography
- **Heading:** Crimson Pro
- **Body:** Atkinson Hyperlegible
- **Mood:** academic, research, scholarly, accessible, readable, educational
- **Best For:** Universities, research papers, academic journals, educational
- **Google Fonts:** https://fonts.google.com/share?selection.family=Atkinson+Hyperlegible:wght@400;700|Crimson+Pro:wght@400;500;600;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Crimson+Pro:wght@400;500;600;700&display=swap');
```

### Key Effects
Testimonial carousel animations, logo grid fade-in, stat counter animations (number count-up), review star ratings

### Avoid (Anti-patterns)
- Complex navigation
- Hidden contact info

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

