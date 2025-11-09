# GlobalPulse News - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from BBC News, Al Jazeera, and The Guardian for their authoritative news presentation combined with modern web aesthetics. Focus on information density, readability, and cross-cultural design patterns.

## Typography System

**Font Hierarchy:**
- Headlines (English): 2xl to 4xl, font-weight 700-800, tight leading
- Headlines (Arabic/Urdu): 2xl to 4xl, font-weight 600-700 (heavier weights can look clunky in Arabic scripts)
- Body text (all languages): base to lg, font-weight 400, relaxed leading for readability
- Category labels: sm uppercase, font-weight 600, tracking-wide
- Timestamps: xs to sm, font-weight 400

**Language-Specific Rendering:**
- English: Clean, modern sans-serif (Noto Sans)
- Arabic: Traditional but web-optimized (Noto Naskh Arabic) 
- Urdu: Calligraphic styling (Noto Nastaliq Urdu) with extra line-height (1.8-2.0)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Card padding: p-4 to p-6
- Section margins: mb-8 to mb-16
- Grid gaps: gap-4 to gap-6
- Container padding: px-4 (mobile) to px-8 (desktop)

**Grid Structure:**
- News Homepage: 3-column masonry grid (desktop), 2-column (tablet), 1-column (mobile)
- Featured story: Full-width or 2-column span
- Videos Page: 2-3 column grid with 16:9 aspect ratio maintained
- Dashboard: 2-column layout (sidebar + main content area)

## Component Library

**News Cards:**
- Image-first cards with 16:9 or 4:3 aspect ratio thumbnails
- Category badge positioned top-left on image
- Headline overlays image (gradient background for readability) OR sits below image
- Metadata row: timestamp, author, read time (icon-based)
- Hover state: Subtle lift (translate-y-1), shadow increase

**Video Cards:**
- Embedded iframe with responsive wrapper (aspect-ratio-16/9)
- Platform indicator badge (YouTube icon, Facebook icon, etc.)
- Title below embed, description truncated to 2-3 lines
- Engagement metrics displayed (views, duration)

**Language Selector:**
- Horizontal pill-style tabs for EN/UR/AR
- Active state: filled background, inactive: outline only
- Positioned top-right of header, mobile: dropdown menu
- Seamless RTL/LTR transition on switch

**Theme Toggle:**
- Sun/moon icon toggle button in header
- Position: Near language selector
- Mobile: Bottom navigation or header

**Header:**
- Logo left (or right in RTL), navigation center, utilities right (or left in RTL)
- Sticky on scroll with backdrop blur effect
- Breaking news ticker below main nav (optional, red accent stripe)
- Secondary navigation: Category filters (Politics, Sports, Tech, Culture, etc.)

**Footer:**
- 4-column grid (desktop): About, Categories, Social, Newsletter
- Social media icons row
- Language selector repeated
- Copyright and legal links

**Dashboard:**
- Left sidebar: Navigation (Articles, Videos, Analytics, Settings)
- Main area: Form-based content creation
- Rich text editor for articles (Urdu/Arabic support essential)
- Image upload with preview
- Video URL input with platform auto-detection
- Category multi-select dropdown
- Publish/Draft toggle

**Social Feed Section:**
- Mixed grid layout showing Twitter embeds, Facebook posts, Instagram snippets
- Each platform gets a subtle border-left accent
- Lazy-load embeds for performance

## Animations

**Theme Transitions:**
- All elements: transition-all duration-300 ease-in-out
- Background shifts smoothly, text fades
- Card shadows animate on theme change
- No jarring flashes, preserve content readability during transition

**Page Entry:**
- News cards: Staggered fade-in (50ms delay between each)
- Video embeds: Skeleton loading state, then fade-in when loaded

**Interactions:**
- Card hover: Scale 1.02, shadow elevation increase
- Button hover: Brightness adjustment (110% light mode, 120% dark mode)
- Language switch: Content fades out (200ms), new content fades in (300ms)
- RTL flip: Smooth transform with 300ms duration

**Scroll Effects:**
- Header shrinks slightly on scroll down (reduce padding)
- Infinite scroll: Loading spinner, smooth content append

## Images

**Homepage:**
- No traditional hero image (news sites prioritize content immediacy)
- Each news card requires a high-quality thumbnail (16:9 ratio)
- Featured story may use larger image (2x1 or 3x2)

**Videos Page:**
- Platform-specific thumbnails before embed load
- Placeholder images for broken video URLs

**Dashboard:**
- Upload interface shows image preview
- Drag-and-drop zone for article thumbnails

**About/Static Pages (if needed):**
- Team photos, office images for "About Us"
- Editorial standards imagery

## Accessibility & RTL Considerations

- Maintain 4.5:1 contrast ratio in both themes
- Focus states visible on all interactive elements
- Skip-to-content link for keyboard navigation
- Flip entire layout for RTL: margin-left becomes margin-right, text-align mirrors
- Ensure social embeds respect RTL context (platform-dependent)
- Icon directions (arrows) flip in RTL layouts

## Dashboard-Specific Design

- Clean, utilitarian interface (prioritize function over flash)
- Form fields with clear labels (multilingual)
- Validation feedback inline with inputs
- Success/error toasts for actions
- Article preview panel showing how content renders in all three languages
- Metrics dashboard: Card-based layout with charts (views, engagement)