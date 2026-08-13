"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/content";

export function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const isOpen = index === openIndex;
        return (
          <Reveal className="faq-reveal" key={faq.question} delay={Math.min(index * 50, 250)}>
            <article className={`faq-item ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span>{faq.question}</span>
                <ChevronDown size={20} />
              </button>
              <div id={`faq-answer-${index}`} className="faq-answer" aria-hidden={!isOpen}>
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
