import { createContext, useState } from "react"

const ValideFormContext = createContext()

const ValideFormProvider = ({ children }) => {
    const [formErrors, setFormErrors] = useState({})

    const validateForm = (formData) => {
        const errors = {}
console.log(formData)
        Object.keys(formData).forEach((key) => {
            const value = formData[key]?.toString()
         
            if (!value) {
                errors[key] = `Vui lòng nhập ${key}`
            } else {
                if (key === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
                errors[key] = "Email không hợp lệ"
                }
                if (key === "phone" && value && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ""))) {
                errors[key] = "Số điện thoại không hợp lệ"
                }
            }
        })
      
        setFormErrors(errors)
        return Object.keys(errors).length
    }

    return (
        <ValideFormContext.Provider value={{ validateForm, formErrors, setFormErrors }}>
        {children}
        </ValideFormContext.Provider>
    )
}

export { ValideFormContext, ValideFormProvider }