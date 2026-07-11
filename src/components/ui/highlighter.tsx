import { useLayoutEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  enabled?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 850,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  enabled = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = enabled && (!isView || isInView)

  useLayoutEffect(() => {
    const element = elementRef.current
    let annotation: RoughAnnotation | null = null
    let resizeObserver: ResizeObserver | null = null
    let frameId = 0
    let timeoutId = 0

    if (shouldShow && element) {
      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      }

      const drawAnnotation = () => {
        annotation?.remove()
        annotation = annotate(element, annotationConfig)
        annotation.show()
      }

      const scheduleRedraw = () => {
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
          frameId = window.requestAnimationFrame(drawAnnotation)
        }, 180)
      }

      drawAnnotation()

      resizeObserver = new ResizeObserver(scheduleRedraw)
      resizeObserver.observe(element)
      resizeObserver.observe(document.body)
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      annotation?.remove()
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    enabled,
  ])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}
