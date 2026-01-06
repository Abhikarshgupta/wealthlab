import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTopOnRouteChange Component
 * Automatically scrolls to top of page when route changes
 * This ensures every page starts at the top when navigated to
 */
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
    })
  }, [pathname])

  return null // This component doesn't render anything
}

export default ScrollToTopOnRouteChange

