import 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useOutsideClick } from '../../hooks/useOutsideClick.ts'

//region [[ Styles ]]
const SelectView = styled.div`
    width: 100%;
    position: relative;
`

const SelectControl = styled.div`
    cursor: pointer;
    border: 1px solid #d1d5db;
    display: grid;
    justify-content: space-between;
    grid-auto-flow: column;
    align-items: center;

    padding: 0.4rem 0.75rem 0.4rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #111827;

    &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
`

const Arrow = styled.span<{ $isOpen: boolean }>`
    display: inline-block;
    transform: ${({ $isOpen }) =>
        $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`

const SelectDropdown = styled.div`
    width: 100%;
    border: 1px solid #ccc;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 180px;
    background-color: #fff;

    position: absolute;
    margin-top: 2px;
    border-radius: 5px;
    z-index: 9999;
`

const SearchContainer = styled.div`
    padding: 8px;
    border: 1px solid #eee;
`

const Search = styled.input`
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
`

const NoOptions = styled.div`
    padding: 8px 12px;
    color: #999;
`

const SelectAllOptions = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    &:hover {
        background-color: #f0f0f0;
    }
`

const SelectAllOptionsCheckBoxContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const Option = styled.div<{ $isSelected: boolean }>`
    padding: 8px 12px;
    cursor: pointer;
    background-color: ${(props) =>
        props.$isSelected ? '#E6F4FF' : 'transparent'};
    display: flex;
    align-items: center;
    border-radius: 3px;
    font-size: 0.8rem;

    &:hover {
        background-color: ${(props) =>
            props.$isSelected ? '#E6F4FF' : '#f0f0f0'};
    }

    color: #444444;
`

const SelectAllSpan = styled.span`
    font-size: 0.8rem;
`
//endregion [[ Styles ]]

export interface Option {
    label: string
    value: string | number
}

interface Props {
    options: Option[]
    multiple?: boolean
    placeholder?: string
    onChange?: (value: Option | Option[]) => void
    defaultValue?: Option | Option[]
    maxSelectedItemsView?: number
    name?: string
}

const DEFAULT_MAX_SELECTED_VIEW = 2

function Select(props: Props) {
    const [selectedValue, setSelectedValue] = useState<
        Option | Option[] | null
    >(props.defaultValue ? props.defaultValue : props.multiple ? [] : null)
    const [searchValue, setSearchValue] = useState<string>('')
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(
        props.options
    )
    const { ref, isOpen, setIsOpen } = useOutsideClick<HTMLDivElement>()

    useEffect(() => {
        if (searchValue.length > 0) {
            const filtered = props.options.filter((option) =>
                option.label.toLowerCase().includes(searchValue.toLowerCase())
            )
            setFilteredOptions(filtered)
        } else {
            setFilteredOptions(props.options)
        }
    }, [searchValue, props.options])

    function toggleDropdown() {
        setIsOpen(!isOpen)
        if (!isOpen) {
            setSearchValue('')
            setFilteredOptions(sortSelected(props.options))
        }
    }

    function handleOptionClick(option: Option) {
        let newValue: Option | Option[] | null

        if (props.multiple) {
            const currentValue = Array.isArray(selectedValue)
                ? selectedValue
                : []
            const optionExists = currentValue.some(
                (item) => item.value === option.value
            )

            newValue = optionExists
                ? currentValue.filter((item) => item.value !== option.value)
                : [...currentValue, option]
        } else {
            newValue = option
            setIsOpen(false)
        }

        setSelectedValue(newValue)

        // Call onChange if provided
        if (props.onChange) {
            props.onChange(newValue as Option | Option[])
        }
    }

    function handleSelectAll() {
        let newValue: Option[]

        if (
            Array.isArray(selectedValue) &&
            selectedValue.length === props.options.length
        ) {
            // deselect all
            newValue = []
        } else {
            // Select all
            newValue = [...props.options]
        }

        setSelectedValue(newValue)

        // Call onChange if provided
        if (props.onChange) {
            props.onChange(newValue)
        }
    }

    function isSelected(option: Option) {
        return Array.isArray(selectedValue)
            ? selectedValue.some((item) => item.value === option.value)
            : selectedValue?.value === option.value
    }

    function getDisplayValue() {
        //Placeholder case
        if (
            !selectedValue ||
            (Array.isArray(selectedValue) && selectedValue.length === 0)
        ) {
            return props.placeholder ?? 'Select item'
        }

        //Multiple case
        if (Array.isArray(selectedValue)) {
            const numberOfItemsToShow =
                props.maxSelectedItemsView ?? DEFAULT_MAX_SELECTED_VIEW

            const visibleItems = selectedValue
                .slice(0, numberOfItemsToShow)
                .map((item) => item.label)
                .join(', ')
            const remainingCount = selectedValue.length - numberOfItemsToShow
            return remainingCount > 0
                ? `${visibleItems}... +${remainingCount} more`
                : visibleItems
        }

        //single case
        return selectedValue.label
    }

    function sortSelected(options: Option[]) {
        return [...options].sort((a, b) => {
            const aSelected = isSelected(a)
            const bSelected = isSelected(b)

            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return 0
        })
    }

    return (
        <SelectView ref={ref}>
            <SelectControl onClick={toggleDropdown} tabIndex={0}>
                <span>{getDisplayValue()}</span>
                <Arrow $isOpen={isOpen}>▼</Arrow>
            </SelectControl>
            {isOpen && (
                <SelectDropdown>
                    <SearchContainer>
                        <Search
                            type={'text'}
                            placeholder={'Search...'}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </SearchContainer>
                    {props.multiple && (
                        <SelectAllOptions onClick={handleSelectAll}>
                            <SelectAllOptionsCheckBoxContainer>
                                <input
                                    type="checkbox"
                                    checked={
                                        Array.isArray(selectedValue) &&
                                        selectedValue.length ===
                                            props.options.length
                                    }
                                    onChange={handleSelectAll}
                                    style={{ marginRight: '8px' }}
                                />
                                <SelectAllSpan>
                                    {Array.isArray(selectedValue) &&
                                    selectedValue.length ===
                                        props.options.length
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </SelectAllSpan>
                            </SelectAllOptionsCheckBoxContainer>
                        </SelectAllOptions>
                    )}

                    <div>
                        {filteredOptions.length === 0 ? (
                            <NoOptions>No Options</NoOptions>
                        ) : (
                            filteredOptions.map((option) => (
                                <Option
                                    key={option.value.toString()}
                                    onClick={() => handleOptionClick(option)}
                                    $isSelected={isSelected(option)}
                                >
                                    {props.multiple && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected(option)}
                                            style={{ marginRight: '8px' }}
                                        />
                                    )}
                                    {option.label}
                                </Option>
                            ))
                        )}
                    </div>
                </SelectDropdown>
            )}
        </SelectView>
    )
}

export default Select
