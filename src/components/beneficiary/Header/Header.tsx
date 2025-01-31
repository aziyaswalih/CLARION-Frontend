import React from 'react'
import { Button } from '../../ui/button'

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full bg-transparent p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold font-serif text-[#774513]">CLARION</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">Home</a>
          <a href="#" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">Causes</a>
          <a href="#" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">About Us</a>
        </nav>
        <Button variant="secondary" className="bg-[#b8860b] hover:bg-[#956d09] text-white">
          Contact Us
        </Button>
      </div>
    </header>
  )
}

export default Header

