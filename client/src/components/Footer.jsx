import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-indigo-700 to-violet-500 transition-all text-white">
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-6">
            <img alt="" className="h-11"
                src={assets.logo} />
        </div>
        <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
            Harness the power of advanced analytics to explore, visualize, and unlock the true potential hidden in your Excel files.
        </p>
    </div>
    <div className="border-t border-[#3B1A7A]">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
            excel analyser ©2025. All rights reserved.
        </div>
    </div>
</footer>
  )
}

export default Footer
