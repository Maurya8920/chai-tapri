import React from 'react';
import { CONFIG } from '../config';
import { Radio, MessageSquareQuote, Clock, ChevronDown, MessageCircle } from 'lucide-react';

export const BelowHero: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative w-full bg-[#150a07] select-none text-white">
      {/* 1. About Section */}
      <section
        id="about"
        className="relative bg-[#1c0704] border-t border-amber-500/10 px-5 sm:px-8 py-16 sm:py-24"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            WELCOME TO
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-white mb-6">
            Chai Tapri — a 90s Indian Chai Tapri, Rebuilt in Sound
          </h2>
          <p className="text-white/70 leading-relaxed text-sm sm:text-base max-w-[700px] mx-auto">
            Chai Tapri is a free ambient radio built at{' '}
            <a
              href={CONFIG.siteUrl}
              className="text-amber-300 underline decoration-amber-500/40 hover:decoration-amber-300"
            >
              {CONFIG.siteUrl}
            </a>{' '}
            to recreate one very specific memory: the roadside chai stall of 90s India, a battered radio on the counter playing Bollywood hits between the clink of glasses and the hiss of the kettle. Press play, and Chai Tapri streams a nonstop mix of 90s Bollywood radio nostalgia.
          </p>
        </div>

        {/* 3 Glass Cards */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5 sm:gap-6 mt-14">
          {/* Card 1 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">90s Bollywood Radio</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              A curated playlist of the era&apos;s biggest chai-tapri radio staples, tuned to keep playing in the background all day.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">Chaiwala Chatter &amp; Quotes</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Rotating one-liners from the tapri&apos;s regulars, woven into the retro soundtrack.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">Always Open</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Chai Tapri is free, streams from your browser, and never closes: no sign-up, no app.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FAQ Accordion Section */}
      <section
        id="faq"
        className="relative bg-[#120806] px-5 sm:px-8 py-16 sm:py-24 border-t border-white/5"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-semibold mb-3 text-center">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-10 text-center">
            Chai Tapri, Explained
          </h2>

          <div className="space-y-3.5">
            {/* Q1 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5" open>
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                What is Chai Tapri?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Chai Tapri is a free ambient radio website built to recreate the mood and nostalgia of a 90s roadside Indian tea stall, playing evergreen Bollywood retro tracks 24x7.
              </p>
            </details>

            {/* Q2 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                Is Chai Tapri free to use?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Yes, completely free. Chai Tapri streams in your browser on both mobile and desktop without sign-up, subscriptions, or intrusive interruptions.
              </p>
            </details>

            {/* Q3 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                What kind of music plays on Chai Tapri?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Chai Tapri streams a curated 41-song rotation of iconic 90s Bollywood melodies, retro cassettes, and timeless Hindi chartbusters from Udit Narayan, Kumar Sanu, Alka Yagnik, Lata Mangeshkar, and more.
              </p>
            </details>

            {/* Q4 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                Where do the songs come from?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Audio is streamed legally through YouTube&apos;s embedded player API. Nothing is hosted on our servers; all copyright remains with the labels, composers, and performers.
              </p>
            </details>

            {/* Q5 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                Can I request a song or a takedown?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Absolutely! Send your suggestions or takedown requests to{' '}
                <a href={`mailto:${CONFIG.contactEmail}`} className="text-amber-400 underline">
                  {CONFIG.contactEmail}
                </a>{' '}
                and we will respond promptly.
              </p>
            </details>

            {/* Q6 */}
            <details className="faq-item group rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-sm sm:text-base list-none">
                Is there a Chai Tapri playlist I can follow?
                <ChevronDown className="faq-chevron w-4 h-4 text-amber-400 transition-transform duration-200" />
              </summary>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Yes, our complete public playlist is available on YouTube and streams continuously right here at Chai Tapri in your browser.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 3. Footer */}
      <footer className="bg-[#0d0503] border-t border-white/5 px-5 sm:px-8 py-8 text-center">
        <p className="font-hindi text-xl text-amber-200/90 mb-1">चाय टपरी</p>
        <p className="text-white/40 text-xs">Chai Tapri Radio · chaitapri.in</p>

        {/* WhatsApp Channel Link */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <a
            href={CONFIG.whatsappChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:text-emerald-300 text-xs font-medium tracking-wide transition-all shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Join WhatsApp Channel</span>
          </a>
        </div>

        <p className="text-white/40 text-[11px] leading-relaxed max-w-xl mx-auto mt-6 px-4">
          Disclaimer: Audio plays through YouTube&apos;s embedded player. Nothing is hosted on this site; all rights stay with the labels, composers and performers.
        </p>

        <p className="text-white/35 text-[11px] font-mono mt-3">
          &copy; {currentYear} Chai Tapri
        </p>
      </footer>
    </div>
  );
};
