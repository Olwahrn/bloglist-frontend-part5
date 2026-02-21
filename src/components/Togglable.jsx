import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  const hiddenStyle = { display: isVisible ? 'none' : '' }
  const shownStyle = { display: isVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setIsVisible(prev => !prev)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hiddenStyle}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={shownStyle}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
