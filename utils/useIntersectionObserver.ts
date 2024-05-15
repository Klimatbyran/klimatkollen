import {
  useState, useCallback, useEffect, RefCallback,
} from 'react'

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const ref = useCallback((element: HTMLElement | null) => {
    setNode(element)
  }, [])

  useEffect(() => {
    let observer: IntersectionObserver | undefined
    if (node) {
      observer = new IntersectionObserver(([entry]) => {
        console.log(entry.isIntersecting, entry.intersectionRatio)
        setIsIntersecting(entry.isIntersecting)
      }, options)
      observer.observe(node)
    }

    return () => {
      if (observer && node) {
        observer.unobserve(node)
      }
    }
  }, [node, options])

  return [ref, isIntersecting] as [RefCallback<HTMLElement | null>, boolean]
}
