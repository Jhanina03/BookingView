import React from 'react'
import { assets } from '../assets/assets';

const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <div className='flex items-center gap-3'>
                        <img className="w-16 md:w-16" src={assets.homeIcon} alt="dummyLogoColored" />
                         <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                        Booking View
                        </h2>
                    </div>
                    <p className="max-w-[410px] mt-6">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright 2025 © <a href="https://prebuiltui.com">PrebuiltUI</a> All Right Reserved.
            </p>
        </div>
  )
}

export default Footer
