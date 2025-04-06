## 🛠️ Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Data Persistence**: API backend for data + `localStorage` for client-side state
- **Styling**: Fully responsive UI with light/dark theme support
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography

---

## ⚙️ Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn

### 📦 Installation

```bash
# Clone the repository
[git clone https://github.com/yourusername/peerhire.git](https://github.com/sumit-kr-sah/peerhire-assignment.git)

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```
/
├── app/
│   ├── client/
│   │   └── page.jsx           # Client dashboard
│   ├── freelancer/
│   │   └── page.jsx           # Freelancer dashboard
│   ├── globals.css            # Global styles
│   ├── layout.jsx             # Root layout
│   └── page.jsx               # Main landing page
├── components/
│   ├── ui/                    # Shadcn UI components library
│   ├── bid-modal.jsx          # Bidding functionality
│   └── rating-modal.jsx       # Rating functionality
├── data/
│   ├── freelancers.js         # Freelancer mock data
│   └── projects.js            # Project mock data
├── lib/
│   └── utils.ts               # Utility functions
└── public/                    # Static assets

```


## 💡 Usage Guide

### 👩‍💼 Client Dashboard

1. **Browse Freelancers** in a responsive card layout  
2. **Search & Filter** by name, description, or skills  
3. **View Profiles** to get full freelancer details  
4. **Manage Projects** by tracking progress and marking them as complete  
5. **Rate Work** with performance feedback and star ratings

### 🧑‍💻 Freelancer Dashboard

The Freelancer Dashboard is designed to help professionals find and manage their project opportunities efficiently.

#### 🔑 Key Features

- **Project Discovery**:
  - Search by project name or description  
  - Filter by required skills  
  - Sort by budget (high to low / low to high)  
  - Sort by timeline (shortest to longest)

- **Bid Management**:
  - Submit detailed proposals for projects  
  - Customize bid amount and delivery timeline  
  - Track the status of all submitted bids (pending, accepted, rejected)  
  - View your bidding history  

- **User Experience**:
  - Responsive design across all devices  
  - Light/Dark mode toggle  
  - Smooth animations via Framer Motion  
  - Real-time proposal status updates  

#### ⚙️ Implementation Details

- Built with React Hooks (`useState`, `useEffect`)
- LocalStorage used to persist bid data across sessions
- `fetch` API for retrieving project information dynamically
- Optimized filtering and sorting functions
- Accessible, modern UI with Shadcn UI components

#### 🚀 Getting Started as a Freelancer

1. Navigate to `/freelancer` to access the dashboard  
2. Use the search and filters to find relevant projects  
3. Click a project card to view details  
4. Submit a proposal with a competitive bid  
5. Track your bid status in the **My Bids** section

---



## 🎨 Customization

### Theme Support
- Toggle between light and dark modes via the **theme switcher** in the UI.

### Styling
- Built with **Tailwind CSS** for fast customization.
- Modify the `tailwind.config.js` to personalize styles.

---

## 🙏 Acknowledgments

- [Lucide React](https://lucide.dev/) for the icons
- [Framer Motion](https://www.framer.com/motion/) for smooth UI animations
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
