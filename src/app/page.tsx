//path: src/app/page.tsx
'use client';

import React from 'react';
import { FullFooter, BndyLogo } from 'bndy-ui';
import { AppHeader } from './components/AppHeader';
import { Music, MapPin, Calendar, Users, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Providers from './providers';

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen flex flex-col">
        <AppHeader />
        
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center bg-orange-500">
              <Music className="w-10 h-10 text-white" />
            </div>

            <div className="mx-auto mb-8">
              <BndyLogo 
                className="mx-auto w-48 md:w-64" 
                color="#f97316"
                holeColor="#1a1f2d"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Keeping </span>
              <span className="text-cyan-500">LIVE</span>
              <span className="text-white"> Music </span>
              <span className="text-orange-500">ALIVE</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              A community-driven platform connecting people to grassroots live music events. 
              No ads, no clutter, just the music you love.
            </p>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
              What We Offer
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Live Music Discovery */}
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <MapPin className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">bndy.Live</h3>
                </div>
                
                <p className="text-slate-700 mb-6">
                  Discover authentic live music events near you without scrolling through social media. Filter by genre, venue, and more - all without ads or algorithmic manipulation.
                </p>
                
                <ul className="space-y-3 mb-6 text-slate-700">
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Interactive map of local events
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Follow your favorite artists and venues
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    No ads, no noise, just music
                  </li>
                </ul>
                
                <a href="https://bndy.live" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium">
                  Explore Live Music
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
              
              {/* Band & Venue Management */}
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                    <Calendar className="w-8 h-8 text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">bndy.App</h3>
                </div>
                
                <p className="text-slate-700 mb-6">
                  A complete management solution for bands, artists, venues, and event organizers. Simplify your music journey with collaborative tools built by musicians, for musicians.
                </p>
                
                <ul className="space-y-3 mb-6 text-slate-700">
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Collaborative setlist builder
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Song repertoire management
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Gig & event promotion tools
                  </li>
                </ul>
                
                <a href="https://backstage.bndy.co.uk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-cyan-500 hover:text-cyan-600 font-medium">
                  Manage Your Music
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Section */}
        <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">A Community-Driven Platform</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Supporting Grassroots</h3>
                <p className="text-slate-600">
                  Built specifically for independent artists, specialist venues, and passionate music fans.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">No Ads, No Noise</h3>
                <p className="text-slate-600">
                  We don&apos;t sell your data or attention. Just pure, direct connections to the music you love.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">By Musicians, For Everyone</h3>
                <p className="text-slate-600">
                  Created by musicians who understand the challenges of the live music scene.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-4 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to experience live music differently?</h2>
            <p className="text-xl text-white mb-8">Join thousands in our community discovering and supporting live music every day.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="px-8 py-3 rounded-full bg-white text-orange-600 hover:bg-orange-50 font-medium text-lg shadow-lg shadow-orange-500/20 transition-all inline-flex items-center justify-center"
              >
                Create Account
              </Link>
              
              <a 
                href="https://bndy.live" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-transparent hover:bg-orange-600 text-white border border-white font-medium text-lg transition-all inline-flex items-center justify-center"
              >
                Explore Live Events
              </a>
            </div>
          </div>
        </section>
        
        <FullFooter badgePath={"/assets/images/BndyBeatBadge.png"} className="mt-auto" />
      </main>
    </Providers>
  );
}