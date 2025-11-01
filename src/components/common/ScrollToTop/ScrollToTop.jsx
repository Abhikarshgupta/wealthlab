import { useState, useEffect } from 'react'

/**
 * ScrollToTop Component
 * 
 * Floating button that appears when user scrolls down
 * Allows quick scroll to top functionality
 * Positioned at bottom right corner
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  /**
   * Handle scroll event to show/hide button
   */
  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * Scroll to top smoothly
   */
  const onScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Handle keyboard navigation
   */
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onScrollToTop()
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={onScrollToTop}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Scroll to top"
      className="
        fixed bottom-6 right-6 z-50
        bg-green-600 hover:bg-green-700 
        dark:bg-green-500 dark:hover:bg-green-600
        text-white 
        rounded-full 
        p-3 
        shadow-lg 
        hover:shadow-xl
        transition-all duration-200
        hover:scale-110
        focus:outline-none 
        focus:ring-2 
        focus:ring-green-500 
        focus:ring-offset-2 
        dark:focus:ring-offset-gray-800
      "
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
    </button>
  )
}

export default ScrollToTop

