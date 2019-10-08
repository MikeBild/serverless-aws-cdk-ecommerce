import { useState, useEffect, SyntheticEvent } from 'react'

interface UseFormProps {
  callback: () => void
  validate: (values: object) => [Error]
}

export const useForm = ({ callback, validate }: UseFormProps) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
  }, [errors])

  const handleSubmit = (event: SyntheticEvent) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    setErrors(validate(values))
  }

  const handleChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    event.persist()
    setValues(values => ({
      ...values,
      [target.name]: target.value,
    }))
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  }
}
