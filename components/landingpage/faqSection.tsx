'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How can I connect with clients on PostMyGig?',
            answer: 'As a freelancer, post your gigs to showcase skills like web development. Clients can ping you, and you can connect instantly using our real-time chat system or email, making collaboration quick and seamless.',
        },
        {
            id: 'item-2',
            question: 'What is the real-time chat feature?',
            answer: 'Our real-time chat lets freelancers and clients message instantly within the app. Discuss projects, share ideas, and finalize details securely, all without sharing personal contact info unless you choose to.',
        },
        {
            id: 'item-3',
            question: 'Is PostMyGig free to use during the beta?',
            answer: 'Yes, PostMyGig is 100% free during our beta phase. Post gigs, send pings, and use real-time chat at no cost.',
        },
        {
            id: 'item-4',
            question: 'Can I manage my gigs easily?',
            answer: 'Absolutely! Freelancers can create, edit, or delete gigs from the dashboard. Update skills, descriptions, or timelines to attract clients, or remove gigs when they’re no longer active.',
        },
        {
            id: 'item-5',
            question: 'How do I join the PostMyGig beta?',
            answer: 'Sign up with Google or X OAuth to join our beta, limited to ~200 early users. Post gigs, use real-time chat, and help shape PostMyGig for India’s freelancers. Follow @i_m_shubham45 on X for updates!',
        },
    ];

    return (
        <section className="bg-gray-50 py-20 px-4 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Title with blue underline */}
                    <div className="mb-6">
                        <h2
                            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: "Arial, sans-serif" }}
                        >
                            Frequently <span className='text-blue-500'>Asked</span> <span className='text-green-500'>Questions</span>
                        </h2>
                        <div className="w-20 h-1 bg-blue-600 rounded mx-auto"></div>
                    </div>

                    <p
                        className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                        style={{ fontFamily: "Arial, sans-serif" }}
                    >
                        Discover quick and comprehensive answers to common questions about our platform, services, and features.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-4xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-white w-full rounded-2xl border border-gray-200 px-8 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-b border-gray-100 last:border-b-0">
                                <AccordionTrigger
                                    className="cursor-pointer text-lg lg:text-xl font-semibold text-gray-900 hover:text-blue-600 hover:no-underline py-6 transition-colors duration-200"
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p
                                        className="text-base lg:text-lg text-gray-600 leading-relaxed pb-4"
                                        style={{ fontFamily: "Arial, sans-serif" }}
                                    >
                                        {item.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                </div>
            </div>
        </section>
    )
}