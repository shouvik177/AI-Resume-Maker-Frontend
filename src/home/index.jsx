import Header from '@/components/custom/Header'
import { UserButton } from '@clerk/clerk-react'
import { AtomIcon, Edit, Share2, Star, Check, Users, Heart } from 'lucide-react'
import React from 'react'

function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Header/>
      <div>
        {/* Hero Section */}
        <section className="z-50">
          <div className="py-16 px-4 mx-auto max-w-screen-xl text-center lg:py-24 lg:px-12">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Build Your Resume <span className='text-emerald-400'>With AI</span>
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 xl:px-48">
              Effortlessly Craft a Standout Resume with Our AI-Powered Builder
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="/dashboard" className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/20">
                Get Started
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
              <span className="font-semibold text-emerald-300 uppercase tracking-wider">Powered By Arbor Academy</span>
            </div> 
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-20 lg:px-12">
          <h2 className="font-bold text-4xl mb-6 text-gray-800">Why Choose Us?</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the features that make us the best choice for your resume building needs.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="block rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AtomIcon className='h-8 w-8 text-emerald-600'/>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Resume Builder</h2>
              <p className="text-gray-600">
                Our AI analyzes your skills and experience to create a professional resume tailored to your needs.
              </p>
            </div>

            <div className="block rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Edit className='h-8 w-8 text-blue-600'/>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Easy Customization</h2>
              <p className="text-gray-600">
                Edit and customize your resume with ease. Add, remove, or rearrange sections in just a few clicks.
              </p>
            </div>

            <div className="block rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className='h-8 w-8 text-purple-600'/>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Share & Download</h2>
              <p className="text-gray-600">
                Share your resume with potential employers or download it in PDF format with a single click.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50 z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-20 lg:px-12">
          <h2 className="font-bold text-4xl mb-6 text-gray-800">What Our Users Say</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Hear from our satisfied users who have landed their dream jobs with our AI-powered resumes.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="block rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex mb-4 text-yellow-400">
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amazing Experience!</h2>
              <p className="text-gray-600 italic mb-6">
                "The AI resume builder is a game-changer. It helped me create a professional resume in minutes!"
              </p>
              <p className="text-sm font-medium text-gray-500">- John Doe</p>
            </div>

            <div className="block rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex mb-4 text-yellow-400">
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Highly Recommended</h2>
              <p className="text-gray-600 italic mb-6">
                "I got multiple interview calls within a week of using this resume builder. Highly recommended!"
              </p>
              <p className="text-sm font-medium text-gray-500">- Jane Smith</p>
            </div>

            <div className="block rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex mb-4 text-yellow-400">
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
                <Star className='h-5 w-5' fill='currentColor'/>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Loved It!</h2>
              <p className="text-gray-600 italic mb-6">
                "The customization options are fantastic. I was able to tailor my resume perfectly for each job application."
              </p>
              <p className="text-sm font-medium text-gray-500">- Alex Johnson</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 opacity-90"></div>
          <div className="relative z-10 px-4 mx-auto max-w-screen-xl text-center">
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Ready to Build Your Resume?
            </h2>
            <p className="mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of users who have successfully landed their dream jobs with our AI-powered resume builder.
            </p>
            <div className="mt-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <a 
                  href="/sign-in" 
                  className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="py-8 bg-gray-900 z-50 px-4 mx-auto max-w-screen-xl text-center">
          <p className="text-sm text-gray-400">
            Crafted with ❤️ by Shouvik Mazumdar | Because every resume deserves a touch of magic!
          </p>
        </section>
      </div>
    </div>
  )
}

export default Home