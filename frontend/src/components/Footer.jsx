import React from 'react'
import { Globe, Mail, Ticket } from 'lucide-react'
import { Button } from './ui/button'

const Footer = () => {
    return (
        <footer className='w-full border-t bg-black/80 text-slate-200'>
            <div className='max-w-7xl mx-auto px-6 py-12'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
                    {/* Brand Section */}
                    <div>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-8 h-8 bg-primary rounded flex items-center justify-center'>
                                <Ticket className='text-white font-semibold' size={20} />
                            </div>
                            <span className='text-xl font-bold'>Bookly</span>
                        </div>
                        <p className='text-sm leading-relaxed'>
                            Bookly is the easiest way to discover and book events. Join our community today.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className='font-semibold  mb-4'>Company</h3>
                        <ul className='space-y-3'>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Press
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className='font-semibold  mb-4'>Resources</h3>
                        <ul className='space-y-3'>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:text-blue-600 text-sm transition-colors'>
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div>
                        <h3 className='font-semibold  mb-4'>Stay Updated</h3>
                        <p className='text-sm mb-4'>
                            Subscribe to our newsletter for the latest events.
                        </p>
                        <div className='flex gap-2'>
                            <input
                                type='email'
                                placeholder='Email address'
                                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                            />
                            <Button className='text-white p-2 rounded-lg transition-colors'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='pt-8 flex border-t flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-gray-400 text-sm'>
                        © 2026 Bookly Inc. All rights reserved.
                    </p>
                    <div className='flex gap-4'>
                        <a href='#' className='text-gray-400 hover:text-blue-600 transition-colors'>
                            <Globe className='w-5 h-5' />
                        </a>
                        <a href='#' className='text-gray-400 hover:text-blue-600 transition-colors'>
                            <Mail className='w-5 h-5' />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer