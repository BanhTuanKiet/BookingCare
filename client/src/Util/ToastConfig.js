import { toast } from "react-toastify"

const toastConfig = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "light",
}

export const success = (content) => {
    toast.success(`${content}`, toastConfig)
}

export const warning = (content) => {
    toast.warning(`${content}`, toastConfig)
}

export const error = (content) => {
    toast.error(`${content}`, toastConfig)
}