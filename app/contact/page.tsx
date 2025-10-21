"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import styles from "./contact.module.css";
import SocialCards from "@/app/components/SocialCards";
import { useState } from "react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-[#00205B]">Contact</motion.h1>

      <div className="mt-3 grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl bg-[#F5F5F5] p-6 border border-[#003DA5]/15">
            <h2 className="text-xl text-[#00205B] mb-4">Advisor</h2>
            <div className="space-y-2">
              <p className="text-sm text-[#00205B]/80">
                <span className="font-medium">Email:</span>{' '}
                <a className="text-[#003DA5] hover:underline" href="mailto:fbla@campbellhigh.net">
                  fbla@campbellhigh.net
                </a>
              </p>
              <div className="pt-4">
                <h3 className="text-lg text-[#00205B] mb-3">Connect With Us</h3>
                <SocialCards />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={styles.formContent}
    >
      <h2 className="text-xl text-[#00205B]">Send a Message</h2>
      <div className="mt-3 grid gap-3">
        <input 
          name="name"
          className="text-sm rounded-md border border-[#003DA5]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[#003DA5]/30 bg-white/80" 
          placeholder="Name" 
          required 
          minLength={2}
          maxLength={100}
        />
        <input 
          type="email" 
          name="email"
          className="text-sm rounded-md border border-[#003DA5]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[#003DA5]/30 bg-white/80" 
          placeholder="Email" 
          required
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          title="Please enter a valid email address"
        />
        <textarea 
          name="message"
          className="text-sm rounded-md border border-[#003DA5]/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[#003DA5]/30 h-28 bg-white/80" 
          placeholder="Your message" 
          required 
          minLength={10}
          maxLength={1000}
        />
        
        {status.type && (
          <div className={`p-3 rounded-md text-sm ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.message}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`text-sm px-3 py-2 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220]'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}