import { useEffect, useRef, useState } from 'react'

export function useOutsideClick<T extends HTMLElement>(initialState = false) {
    const ref = useRef<T>(null)
    const [isOpen, setIsOpen] = useState(initialState)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return { ref, isOpen, setIsOpen }
}
