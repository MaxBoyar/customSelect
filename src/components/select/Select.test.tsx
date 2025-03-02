import { render, screen, fireEvent } from '@testing-library/react'
import Select, { Option } from './Select'
import { describe, it, expect, vi } from 'vitest'

const options: Option[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
]

describe('Select Component', () => {
    it('renders with a placeholder', () => {
        render(<Select options={options} placeholder="Choose an option" />)
        expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('opens dropdown when clicked', () => {
        render(<Select options={options} />)
        const selectControl = screen.getByText('Select item') // Default placeholder

        fireEvent.click(selectControl)
        expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('selects a single option and closes dropdown', () => {
        const handleChange = vi.fn()
        render(<Select options={options} onChange={handleChange} />)

        fireEvent.click(screen.getByText('Select item'))
        fireEvent.click(screen.getByText('Option 2'))

        expect(screen.getByText('Option 2')).toBeInTheDocument()
        expect(handleChange).toHaveBeenCalledWith({
            label: 'Option 2',
            value: 2,
        })
    })

    it('selects multiple options run onChange and keeps dropdown open', () => {
        const handleChange = vi.fn()
        render(<Select options={options} multiple onChange={handleChange} />)

        fireEvent.click(screen.getByText('Select item'))
        fireEvent.click(screen.getByText('Option 1'))
        fireEvent.click(screen.getByText('Option 2'))

        expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument()
        expect(handleChange).toHaveBeenCalledTimes(2)
    })

    it("selects all options when 'Select All' is clicked", () => {
        const handleChange = vi.fn()
        render(<Select options={options} multiple onChange={handleChange} />)

        fireEvent.click(screen.getByText('Select item'))
        fireEvent.click(screen.getByText('Select All'))

        expect(handleChange).toHaveBeenCalledWith(options)
    })
})
