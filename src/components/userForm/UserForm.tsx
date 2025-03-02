import 'react'
import styled from 'styled-components'
import { ChangeEvent, FormEvent, useState } from 'react'
import Select, { Option } from '../select/Select.tsx'

//region [[ Styles ]]
const UserFormView = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #ebf4ff, #f5f3ff);
`

const Card = styled.div`
    width: 100%;
    max-width: 25rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 2rem;
`

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #1f2937;
    margin-bottom: 1.5rem;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`

const FormGroup = styled.div`
    display: grid;
`

const Label = styled.label`
    font-size: 0.8rem;
    font-weight: 500;
    color: #48515e;
`

const InputField = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 1rem;
    border-radius: 0.375rem;
    outline: none;
    transition: all 150ms ease-in-out;
    border: 1px solid #d1d5db;
    color: #111827;

    &:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }

    &::placeholder {
        color: #9ca3af;
    }
`

const Button = styled.button`
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background-color: #6366f1;
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 150ms ease-in-out;

    &:hover:not(:disabled) {
        background-color: #4f46e5;
    }

    &:hover:disabled {
        background-color: #4f46e5;
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
    }
`
//endregion [[ Styles ]]

interface FormData {
    name: string
    country: Option | null
    interests: Option[]
}

const countryOptions: Option[] = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
    { label: 'Brazil', value: 'br' },
    { label: 'India', value: 'in' },
    { label: 'China', value: 'cn' },
]

const interestOptions: Option[] = [
    { label: 'Technology', value: 'technology' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Music', value: 'music' },
    { label: 'Sports', value: 'sports' },
    { label: 'Travel', value: 'travel' },
    { label: 'Photography', value: 'photography' },
    { label: 'Art', value: 'art' },
    { label: 'Fitness', value: 'fitness' },
    { label: 'Food', value: 'food' },
    { label: 'Science', value: 'science' },
]

function UserForm() {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        interests: [],
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSelectChange = (
        name: keyof FormData,
        option: Option | Option[]
    ): void => {
        setFormData({
            ...formData,
            [name]: Array.isArray(option)
                ? option.map((opt) => opt.label)
                : option.label,
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log('Form submitted successfully', formData)
        } catch (error) {
            console.error('Error submitting form', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <UserFormView>
            <Card>
                <Title>User Registration</Title>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Name</Label>
                        <InputField
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Jordan Belfort..."
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Country</Label>
                        <Select
                            options={countryOptions}
                            placeholder="Select a country"
                            onChange={(value) =>
                                handleSelectChange('country', value as Option)
                            }
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Interests</Label>
                        <Select
                            options={interestOptions}
                            placeholder="Select your interests"
                            onChange={(value) =>
                                handleSelectChange(
                                    'interests',
                                    value as Option[]
                                )
                            }
                            multiple={true}
                        />
                    </FormGroup>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
            </Card>
        </UserFormView>
    )
}

export default UserForm
