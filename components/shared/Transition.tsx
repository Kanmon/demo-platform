import React, { useRef, useEffect, useContext } from 'react'
import { CSSTransition as ReactCSSTransition } from 'react-transition-group'

const TransitionContext = React.createContext({
  parent: {
    show: false,
    isInitialRender: false,
    appear: false,
  },
})

function useIsInitialRender() {
  const isInitialRender = useRef(true)
  useEffect(() => {
    isInitialRender.current = false
  }, [])
  return isInitialRender.current
}

const CSSTransition = ({
  show = false,
  appear = false,
  enter = '',
  enterStart = '',
  enterEnd = '',
  leave = '',
  leaveStart = '',
  leaveEnd = '',
  unmountOnExit,
  children,
  ...rest
}: {
  show?: boolean
  appear?: boolean
  enter?: string
  enterStart?: string
  enterEnd?: string
  leave?: string
  leaveStart?: string
  leaveEnd?: string
  unmountOnExit?: boolean
  children?: React.ReactNode
}) => {
  const enterClasses = enter.split(' ').filter((s) => s.length)
  const enterStartClasses = enterStart.split(' ').filter((s) => s.length)
  const enterEndClasses = enterEnd.split(' ').filter((s) => s.length)
  const leaveClasses = leave.split(' ').filter((s) => s.length)
  const leaveStartClasses = leaveStart.split(' ').filter((s) => s.length)
  const leaveEndClasses = leaveEnd.split(' ').filter((s) => s.length)
  const removeFromDom = unmountOnExit

  function addClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.add(...classes)
  }

  function removeClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.remove(...classes)
  }

  const nodeRef = React.useRef<HTMLDivElement>(null)

  return (
    <ReactCSSTransition
      appear={appear}
      nodeRef={nodeRef}
      unmountOnExit={removeFromDom}
      in={show}
      addEndListener={(done) => {
        if (nodeRef.current) {
          nodeRef.current.addEventListener('transitionend', done, false)
        }
      }}
      onEnter={() => {
        if (nodeRef.current) {
          if (!removeFromDom) nodeRef.current.style.display = 'block'
          addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses])
        }
      }}
      onEntering={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, enterStartClasses)
          addClasses(nodeRef.current, enterEndClasses)
        }
      }}
      onEntered={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses])
        }
      }}
      onExit={() => {
        if (nodeRef.current) {
          addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses])
        }
      }}
      onExiting={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, leaveStartClasses)
          addClasses(nodeRef.current, leaveEndClasses)
        }
      }}
      onExited={() => {
        if (nodeRef.current) {
          removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses])
          if (!removeFromDom) nodeRef.current.style.display = 'none'
        }
      }}
    >
      <div
        ref={nodeRef}
        {...rest}
        style={{ display: !removeFromDom ? 'none' : 'block' }}
      >
        {children}
      </div>
    </ReactCSSTransition>
  )
}

export const Transition = ({
  show = false,
  appear = false,
  ...rest
}: {
  show?: boolean
  appear?: boolean
  className?: string
  enter?: string
  enterStart?: string
  enterEnd?: string
  leave?: string
  leaveStart?: string
  leaveEnd?: string
  unmountOnExit?: boolean
  children?: React.ReactNode
}) => {
  const { parent } = useContext(TransitionContext)
  const isInitialRender = useIsInitialRender()
  const isChild = show === undefined

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    )
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  )
}

export default Transition
