# WebAtlas - Curated Web Directory

A modern, fully responsive web directory application showcasing curated collections of tools, resources, and websites organized by category.

## 🎯 Features

- **Multiple Collections**: Organized by Work, Entertainment, Developer Tools, and Personal Projects
- **Advanced Search**: Full-text search across names, descriptions, categories, and tags
- **Tag Filtering**: Filter items by relevant tags with multi-select support
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Modern UI**: Dark theme with warm orange accents, glassmorphism effects, and smooth animations
- **Fast Navigation**: Sidebar-based collection selection for quick access

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **Language**: TypeScript
- **UI Components**: Custom components with shadcn/ui integration

## 📁 Project Structure

```
app/
├── page.tsx              # Main application page
├── layout.tsx            # Root layout with metadata
└── globals.css           # Global styles and design tokens

components/
├── item-card.tsx         # Individual item card component
├── sidebar.tsx           # Navigation sidebar with collections
├── search-bar.tsx        # Search input component
└── filter-tags.tsx       # Tag filter component

lib/
├── markdown-loader.ts   # Loads and parses markdown collections
├── work.md              # Work collection data
├── entertainment.md     # Entertainment collection data
├── developer.md         # Developer Tools collection data
├── personal.md          # Personal Projects collection data
└── utils.ts             # Utility functions (cn)
```

## 🎨 Design Highlights

- **Color Scheme**: Dark background (oklch 0.08) with warm orange accents (oklch 0.6 0.14 41)
- **Typography**: Clean sans-serif with proper hierarchy
- **Interactions**: Smooth hover states, transitions, and focus indicators
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

## 📦 Collections Included

1. **Work** (💼) - 8 items
   - Project management tools, HR software, communication platforms

2. **Entertainment** (🎬) - 8 items
   - Streaming services, ticketing platforms, content providers

3. **Developer Tools** (💻) - 8 items
   - UI component libraries, CSS frameworks, design systems

4. **Personal Projects** (🎯) - 8 items
   - AI chatbots, image generation, writing tools, video editors

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🔍 How to Use

1. **Browse Collections**: Click on a collection in the sidebar to filter items
2. **Search**: Use the search bar to find items by name, description, or category
3. **Filter by Tags**: Click tags to filter items by multiple criteria
4. **Visit Items**: Click any card to visit the external website in a new tab

## 📊 Data Structure

Items contain:
- **Name**: Title of the resource
- **URL**: External link
- **Description**: Brief overview
- **Category**: Primary category
- **Pricing**: Free, Freemium, or Paid
- **Tags**: Multiple searchable tags
- **Rank** (optional): Ranking within category

## 🎯 Responsive Breakpoints

- **Mobile**: Single column layout
- **Tablet**: 2-column grid (md)
- **Desktop**: 3-column grid (lg)
- **Wide**: 4-column grid (xl)

## 🧩 Key Components

### ItemCard
Displays individual items with hover effects, pricing badges, and tag chips.

### Sidebar
Fixed navigation showing all collections with item counts and emoji indicators.

### SearchBar
Full-featured search input with clear button and query highlighting.

### FilterTags
Interactive tag selection system for multi-criteria filtering.

## 🎨 Customization

### Adding New Collections
Edit the markdown files in `lib/` (`work.md`, `entertainment.md`, `developer.md`, `personal.md`) and add entries in this format:

```md
- **Name**: Example Tool
- **URL**: https://example.com
- **Category**: Example Category
- **Description**: Short description of the tool.
- **Pricing**: Free
- **Tags**: tag-one, tag-two
```

### Styling
Modify design tokens in `app/globals.css` under the `:root` selector:

```css
--accent: oklch(0.6 0.14 41);  /* Warm orange */
--background: oklch(0.08 0 0); /* Dark gray */
```

## 📱 Mobile Experience

- Sidebar converts to a responsive drawer on mobile
- Full-width search and filter interface
- Touch-optimized spacing and buttons
- Maintains all functionality on smaller screens

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📝 License

This project is open source and available under the MIT License.

## 💡 Future Enhancements

- User accounts and favorites
- Collections sharing and creation
- Advanced filtering with date ranges
- Dark/Light theme toggle
- Export collections as JSON
- API endpoint for programmatic access
