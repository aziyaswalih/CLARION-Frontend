import React from 'react'
import { Button } from '../../ui/button'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2c2520] text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">CLARION</h3>
          <p className="text-2xl font-bold text-[#b8860b]">10k+</p>
          <p className="text-sm">Worldwide Clients Connected</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#b8860b]">Home</a></li>
            <li><a href="#" className="hover:text-[#b8860b]">About Us</a></li>
            <li><a href="#" className="hover:text-[#b8860b]">Photo Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
          <ul className="space-y-2">
            <li>123 Street, City Name</li>
            <li>State, Country 12345</li>
            <li>contact@clarion.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-white/10 rounded px-3 py-2"
            />
            <Button className="bg-[#b8860b] hover:bg-[#956d09]">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

