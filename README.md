# 4over.com Replica - Canvas & UI Enhancements

This project is a complete, production-ready, Next.js (v13+) functional and visual replica of the 4over.com printing website. It was built using the Next.js App Router, Tailwind CSS, and Fabric.js for the canvas editor.

## 1. Setup & Run Instructions

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd <repository-name>
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`

The application will be available at `http://localhost:3000`.

## 2. Credentials & Environment

### Test User

For mock login functionality, use the following credentials:
-   **Email**: `shaibby@gmail.com`
-   **Password**: `1azalea@NANUET`

### Environment Variables

This project uses placeholders for environment variables. You can create a `.env.local` file in the root of the project, but it is not required for the current mock implementation.

\`\`\`bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://4over.com/api
NEXTAUTH_SECRET=your-super-secret-key-for-production
\`\`\`

## 3. Folder Structure Overview

The project follows the standard Next.js App Router structure:

\`\`\`
.
├── app/                      # Main application folder
│   ├── (auth)/               # Route group for authentication pages
│   │   └── login/
│   ├── (main)/               # Route group for main app layout
│   │   ├── business-cards/
│   │   └── standard-business-cards/
│   ├── api/                  # API routes (if any)
│   ├── components/           # Reusable React components
│   │   ├── auth/
│   │   ├── editor/
│   │   ├── home/
│   │   ├── layout/
│   │   └── products/
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and data
├── providers/                # React Context providers
├── public/                   # Static assets (images, fonts)
└── tailwind.config.ts        # Tailwind CSS configuration
\`\`\`

## 4. Canvas Editor Updates

### Enhanced Toolbar (Left to Right)
1. **Transform Tools**: Flip horizontal/vertical, rotate left/right (90°)
2. **Scale Tools**: Scale up/down (10% increments), fit to template
3. **Position Tools**: Nudge controls (↑→↓← by 1% increments)
4. **View Tools**: Pan mode, 3D perspective view, magnifier
5. **Guidelines**: Toggle all guidelines, toggle cut lines only
6. **Mask Controls**: Opacity slider, transparency mode
7. **History**: Undo/redo (20-step stack), reset view

### Key Features
- **Bleed Validation**: Real-time checking that artwork extends to black bleed line
- **Visual Guidelines**: Black (bleed), red (cut), blue (safe) lines with toggle controls
- **Interactive Tools**: All toolbar icons wired to Fabric.js APIs
- **Fit to Template**: Automatically scales and centers artwork to bleed edges
- **3D Preview**: Simple perspective transformation
- **History Management**: 20-step undo/redo stack

### Guideline Enforcement
- Overlay guidelines at correct positions relative to canvas
- Real-time validation on every transform/scale/rotate/nudge
- Red warning alert when artwork doesn't reach bleed line
- Warning message: "The artwork does not extend all the way to the black bleed line..."

## 5. Global UI Enhancements

### Color & Typography
- **Primary Color**: `#00AAB2` (teal) - consistent across all interactive elements
- **Secondary Color**: `#1E2A38` (dark blue-gray) - for text and accents
- **Typography**: Standardized heading sizes (`text-2xl`, `text-lg`, `text-base`)

### Spacing & Layout
- **Card Padding**: Increased from `p-6` to `p-8` for better breathing room
- **Grid Gaps**: Consistent `gap-6` spacing throughout
- **Mobile Responsive**: Graceful stacking on smaller screens

### Interactive Elements
- **Buttons**: Uniform `rounded-lg`, `shadow-sm`, `hover:scale-105` effects
- **Form Inputs**: Consistent border radius, focus states with primary color
- **Cards**: Subtle `hover:shadow-lg` transitions
- **Focus States**: Clear `ring-2` outlines for accessibility

### Accessibility Improvements
- All interactive elements have proper `aria-label` attributes
- Focus outlines visible and consistent
- Smooth scroll behavior for in-page navigation
- Color contrast meets WCAG guidelines

## 6. Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## 7. Deployment

The project is optimized for Vercel deployment with no additional configuration needed.

\`\`\`bash
vercel --prod
\`\`\`

## 8. Canvas Workflow

1. **Upload**: Select image/PDF files
2. **Edit**: Use comprehensive toolbar for adjustments
3. **Validate**: Check bleed compliance warnings
4. **Submit**: Bypass preflight and submit artwork

The canvas editor now provides professional-grade tools matching industry printing standards.
