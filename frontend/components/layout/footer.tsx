import Link from "next/link"
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-800" />
              </div>
              <span className="text-2xl font-bold">ArenaAxis</span>
            </div>
            <p className="text-green-100 mb-4">Find. Book. Play</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-green-100 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/fields" className="block text-green-100 hover:text-white transition-colors">
                Book
              </Link>
              <Link href="/tournaments" className="block text-green-100 hover:text-white transition-colors">
                Tournaments
              </Link>
              <Link href="/contact" className="block text-green-100 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/about" className="block text-green-100 hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-100">
                <Mail className="w-4 h-4" />
                <span>arenaaxis@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100">
          <p>© 2025 ArenaAxis. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
