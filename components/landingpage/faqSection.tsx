'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
        <section className="bg-background py-12 md:py-20">
            <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
                    <h2 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                </div>

                {/* FAQ Accordion Container */}
                <div className="mx-auto max-w-3xl">
                    <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-10 shadow-sm">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-b-2 border-border last:border-b-0"
                                >
                                    <AccordionTrigger
                                        className="cursor-pointer text-base sm:text-lg lg:text-xl font-bold text-foreground hover:text-primary hover:no-underline py-4 sm:py-6 text-left transition-colors"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p
                                            className="text-sm sm:text-base lg:text-lg font-normal text-muted-foreground leading-relaxed pb-4 sm:pb-6"
                                            style={{ fontFamily: "var(--font-sans)" }}
                                        >
                                            {item.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}