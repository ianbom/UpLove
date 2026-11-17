"use client";

import { faqs } from "@/data/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqList() {
  const middle = Math.ceil(faqs.length / 2);
  return <div className="grid gap-x-14 md:grid-cols-2">{[faqs.slice(0, middle), faqs.slice(middle)].map((group, index) => <Accordion key={index} type="multiple">{group.map((faq, item) => <AccordionItem key={faq.question} value={`faq-${index}-${item}`} className="border-b border-border"><AccordionTrigger className="min-h-20 py-6 text-left text-base font-semibold">{faq.question}</AccordionTrigger><AccordionContent className="pb-6 text-[15px] leading-7 text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion>)}</div>;
}
