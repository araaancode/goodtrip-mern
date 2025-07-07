import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'
import { showNotification } from "../common/headerSlice"
import { addNewLead } from "../leads/leadSlice"

const INITIAL_ADMIN_OBJ = {
    first_name : "",
    last_name : "",
    email : "",
    phone:"",
    role:"",
    password:"",
    confirmPassword:"",
}

function UpdateAdmin({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_ADMIN_OBJ)


    const saveNewLead = () => {
        if(leadObj.first_name.trim() === "")return setErrorMessage("نام باید وارد شود!")
        else if(leadObj.last_name.trim() === "")return setErrorMessage("نام خانوادگی باید وارد شود!")
        else if(leadObj.email.trim() === "")return setErrorMessage("ایمیل باید وارد شود!")
        else if(leadObj.phone.trim() === "")return setErrorMessage("شماره همراه باید وارد شود!")
        else if(leadObj.role.trim() === "")return setErrorMessage("نقش باید وارد شود!")
        else{
            let newLeadObj = {
                "id": 7,
                "email": leadObj.email,
                "first_name": leadObj.first_name,
                "last_name": leadObj.last_name,
                "phone": leadObj.phone,
                "role": leadObj.role,
                "avatar": "https://cdn-icons-png.flaticon.com/128/2632/2632839.png"
            }
            dispatch(addNewLead({newLeadObj}))
            dispatch(showNotification({message : "New Lead Added!", status : 1}))
            closeModal()
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLeadObj({...leadObj, [updateType] : value})
    }

    return(
        <>

            <InputText type="text" defaultValue={leadObj.first_name} updateType="first_name" containerStyle="mt-4" labelTitle="نام" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={leadObj.last_name} updateType="last_name" containerStyle="mt-4" labelTitle="نام خانوادگی" updateFormValue={updateFormValue}/>
            <InputText type="email" defaultValue={leadObj.email} updateType="email" containerStyle="mt-4" labelTitle="ایمیل" updateFormValue={updateFormValue}/>
            <InputText type="phone" defaultValue={leadObj.phone} updateType="phone" containerStyle="mt-4" labelTitle="شماره همراه" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={leadObj.role} updateType="role" containerStyle="mt-4" labelTitle="نقش" updateFormValue={updateFormValue}/>
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>لغو</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewLead()}>تایید</button>
            </div>
        </>
    )
}

export default UpdateAdmin