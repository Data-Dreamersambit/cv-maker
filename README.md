# CV Extractor + Builder 🚀

A modern, high-performance, 100% client-side web application for extracting, structuring, editing, and exporting resumes from **PDF** and **DOCX** files with zero server-side dependencies.

---

## ✨ Features

- 📄 **Universal File Upload**: Accepts `.pdf` and `.docx` resume formats with instant in-browser parsing.
- ⚡ **Rule-Based Heuristic Extraction**: Fast, offline field extractor that segments contact details (email, phone, LinkedIn, GitHub, portfolio), candidate names, professional titles, work history with date ranges, education, skills, projects, and certifications without requiring any paid APIs.
- 🖼️ **Photo Handling**:
  - Auto-extracts embedded photos from DOCX files via Mammoth.
  - Interactive PDF Page 1 canvas cropping tool to select and crop headshot avatars.
  - Direct image file upload support (JPG, PNG, WebP).
- ✍️ **Dynamic Form Editor**:
  - Repeatable entries with Move Up / Move Down reordering and deletions.
  - Multi-bullet achievement lists per position.
  - Interactive tag-style pill input for skills with Enter/comma shortcuts and suggestions.
- 💾 **Browser LocalStorage Persistence**:
  - Automatic debounced (500ms) background saving.
  - Multi-resume manager drawer to create, duplicate, switch, and delete multiple drafts independently.
  - Full **JSON Backup Import / Export**.
- 🎨 **Multi-Template Live Preview**:
  - **Modern Two-Column**: Sleek sidebar layout balancing photo, contact, skills, and work history.
  - **Classic ATS Single-Column**: High-density, traditional serif layout optimized for automated applicant tracking systems.
  - **Minimal Executive**: Bold typography with customizable accent badge colors.
  - 6 accent color themes (Indigo, Royal Blue, Emerald, Slate, Rose, Violet) and zoom scaling controls.
- 🖨️ **Print-Ready PDF Export**:
  - Dedicated `@media print` engine preserving page-break integrity (`break-inside: avoid`), true selectable text, and dynamic candidate document naming.
- 🤖 **Optional Smart Parse (LLM BYOK)**:
  - Client-side Bring-Your-Own-Key support for OpenAI, Anthropic Claude, and Google Gemini for messy or non-standard resumes.
  - Non-destructive selective merge review modal.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **PDF Engine**: `pdfjs-dist` (with Web Worker & Canvas)
- **DOCX Engine**: `mammoth` (browser build)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (Zero Backend)

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🌐 Deployment

The application is completely static and client-side, making it ready to deploy on **Vercel**, **Netlify**, or **GitHub Pages** with zero backend infrastructure.
