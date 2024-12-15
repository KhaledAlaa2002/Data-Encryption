import React from 'react'
import { ModeToggle } from './modeToggler'
import Image from 'next/image'
import logo from "@/images/logo.png"
import logoDark from "@/images/logoDark.png"
const Navbar = () => {
  return (
    <div className='px-12 py-8 flex justify-between items-center'>
      <Image src={logo} alt='logo' className='dark:hidden w-28' />
      <Image src={logoDark} alt='logoDark' className='hidden w-28 dark:flex' />
      <ModeToggle />
      
    </div>
  )
}

export default Navbar