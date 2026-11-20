// import Link from "next/link";
// import { Mail, MapPin, Phone, Pizza } from "lucide-react";

// const quickLinks = [
//   { label: "Home", href: "/" },
//   { label: "Menu", href: "/menu" },
//   { label: "About", href: "/about" },
//   { label: "Contact", href: "/contact" },
// ];

// const accountLinks = [
//   { label: "Login", href: "/login" },
//   { label: "Register", href: "/register" },
//   { label: "Become a Vendor", href: "/register" },
// ];

// export function Footer() {
//   return (
//     <footer className="border-t bg-muted/40">
//       <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
//         {/* Brand */}
//         <div className="space-y-4">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
//               <Pizza className="h-5 w-5" />
//             </span>
//             <span className="font-[family-name:var(--font-poppins)] text-xl font-bold">
//               Pizza<span className="text-orange-500">Hub</span>
//             </span>
//           </Link>
//           <p className="text-sm text-muted-foreground">
//             Fresh, hot pizza from your favorite local vendors, delivered
//             straight to your door.
//           </p>
//         </div>

//         {/* Quick links */}
//         <div>
//           <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
//             Quick Links
//           </h3>
//           <ul className="space-y-2">
//             {quickLinks.map((link) => (
//               <li key={link.label}>
//                 <Link
//                   href={link.href}
//                   className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Account */}
//         <div>
//           <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
//             Account
//           </h3>
//           <ul className="space-y-2">
//             {accountLinks.map((link) => (
//               <li key={link.label}>
//                 <Link
//                   href={link.href}
//                   className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Contact */}
//         <div>
//           <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
//             Contact
//           </h3>
//           <ul className="space-y-3 text-sm text-muted-foreground">
//             <li className="flex items-start gap-2">
//               <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
//               <span>House 12, Road 5, Dhaka, Bangladesh</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <Phone className="h-4 w-4 shrink-0 text-orange-500" />
//               <span>+880 1234 567890</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <Mail className="h-4 w-4 shrink-0 text-orange-500" />
//               <span>support@pizzahub.com</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="border-t">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
//           <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
//           <p>Built with Next.js & Tailwind CSS</p>
//         </div>
//       </div>
//     </footer>
//   );
// }



import Link from "next/link";
import { Mail, MapPin, Phone, Pizza } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Become a Vendor", href: "/register" },
];

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
              <Pizza className="h-5 w-5" />
            </span>
            <span className="font-[family-name:var(--font-poppins)] text-xl font-bold">
              Pizza<span className="text-orange-500">Hub</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Fresh, hot pizza from your favorite local vendors, delivered
            straight to your door.
          </p>
          
          {/* Social Links Added Here */}
          <div className="flex gap-4 pt-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-orange-500"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
            Account
          </h3>
          <ul className="space-y-2">
            {accountLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-wider">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <span>House 12, Road 5, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-orange-500" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-orange-500" />
              <span>support@pizzahub.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
          {/* Replaced the Next.js text with something relevant */}
          <p>Made with 🍕 for pizza lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}