import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const fadeInUp = (element: string | Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 1, delay, ease: "power4.out" }
  )
}

export const staggerChildren = (parent: string, children: string, stagger = 0.1) => {
  gsap.fromTo(
    children,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: "power3.out",
      scrollTrigger: { trigger: parent, start: "top 80%" },
    }
  )
}

export const parallaxScroll = (element: string, speed = 0.5) => {
  gsap.to(element, {
    y: `${(1 - speed) * 100}%`,
    ease: "none",
    scrollTrigger: { trigger: element, scrub: true },
  })
}

export const scaleIn = (element: string | Element, delay = 0) => {
  gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.2, delay, ease: "power4.out" }
  )
}

export const textReveal = (element: string | Element, delay = 0) => {
  gsap.fromTo(
    element,
    { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0% 0 0)", duration: 1.5, delay, ease: "power4.out" }
  )
}
