🐾 Paw Care (Clinicat Veterinary Care)

Expert care for your beloved pets.

Paw Care is a full-stack veterinary care platform that lets pet parents book grooming, vet check-ups, dental cleaning, and more — all in one place. Built with modern web technologies and a warm, pet-friendly design.

🌐 Live demo: https://paw-care-liard.vercel.app/



Features





Home & marketing pages — Hero, services overview, “Why choose us”, testimonials, and vet team showcase



Services — Browse available pet care services



Vets — Meet the veterinary team



Appointment booking — Schedule visits for grooming, check-ups, and more



Pet management — Add and manage pet profiles



Authentication — Sign in / sign up with NextAuth



Dashboard — User dashboard for managing appointments and pets



About & Contact — Clinic information and contact options



Responsive UI — Clean, modern interface with dark mode support



Image uploads — Cloudinary integration for media



Tech Stack







Layer



Technologies





Framework



Next.js 16 (App Router)





UI



React 19, Tailwind CSS 4, shadcn/ui, Lucide icons





Auth



NextAuth.js





Database



MongoDB





Data fetching



TanStack Query (React Query)





Forms



React Hook Form





Media



Next Cloudinary





Notifications



React Hot Toast





Theming



next-themes



Project Structure

paw-care/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── Components/     # Shared UI sections (Hero, Services, etc.)
│   │   ├── about/          # About page
│   │   ├── api/            # API routes
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   ├── pets/
│   │   │   ├── services/
│   │   │   ├── users/
│   │   │   └── vet/
│   │   ├── appointment/    # Booking flow
│   │   ├── auth/           # Auth pages
│   │   ├── contact/        # Contact page
│   │   ├── dashboard/      # User dashboard
│   │   ├── pets/           # Pet management
│   │   ├── services/       # Services listing
│   │   ├── vets/           # Vet team pages
│   │   ├── layout.jsx
│   │   └── page.jsx        # Home
│   ├── components/ui/      # shadcn UI primitives
│   └── lib/                # Utilities & helpers
├── package.json
└── ...



Getting Started

Prerequisites





Node.js 18+



MongoDB (local or MongoDB Atlas)



(Optional) Cloudinary account for image uploads



(Optional) OAuth provider credentials for NextAuth

Installation





Clone the repository

git clone https://github.com/Owasi04/paw-care.git
cd paw-care



Install dependencies

npm install



Environment variables

Create a .env.local file in the root:

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# Optional: Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: OAuth providers (if configured)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=



Run the development server

npm run dev

Open http://localhost:3000 in your browser.

Scripts







Command



Description





npm run dev



Start development server





npm run build



Create production build





npm start



Start production server





npm run lint



Run ESLint



Pages Overview







Route



Description





/



Landing page (hero, services, testimonials, team)





/services



Service catalog





/vets



Veterinary team





/appointment



Book an appointment





/pets



Manage pet profiles





/dashboard



User dashboard





/auth



Sign in / sign up





/about



About the clinic





/contact



Contact form / info



Design

UI designs and prototypes are available on Google Stitch:

→ Stitch project



Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.





Fork the repo



Create a feature branch (git checkout -b feature/amazing-feature)



Commit your changes (git commit -m 'Add amazing feature')



Push to the branch (git push origin feature/amazing-feature)



Open a Pull Request



License

This project is private / unlicensed unless otherwise specified by the author.



Author

Owasi04 — GitHub



Made with ❤️ for pets and their humans
