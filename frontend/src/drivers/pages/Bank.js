import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPageTitle } from '../features/common/headerSlice'
import Subtitle from "../components/Typography/Subtitle"
import { ToastContainer, toast } from 'react-toastify';
import { CiCreditCard2 } from "react-icons/ci"

const TopSideButtons = () => {

  const dispatch = useDispatch()
}

const Bank = () => {
  const [sheba, setSheba] = useState("")
  const [shebaError, setShebaError] = useState(false)
  const [shebaErrorMessage, setShebaErrorMessage] = useState("")

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageTitle({ title: "بانک" }))
  }, [])


  const addAccount = () => {
    if (!sheba || sheba === "" || sheba === undefined || sheba === null) {
      setShebaError(true)
      setShebaErrorMessage("* شماره شبا باید وارد شود")
    } else {

      toast.success('به حساب متصل شدید', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }

  }

  const handleShebaChange = (e) => {
    e.preventDefault();
    var inputValue = e.target.value
    if (!inputValue.startsWith("IR")) {
      inputValue = "IR" + inputValue.slice(2);
    }
    // Limit to 26 characters (IR + 24)
    if (inputValue.length <= 26) {
      setSheba(inputValue);
    }

    if (inputValue.length < 26) {
      setShebaError(true)
      setShebaErrorMessage("* شماره شبا باید 24 رقمی باشد");
    } else {
      setShebaError(false)
      setShebaErrorMessage("");
    }
  }


  return (
    <>
      <div className={"card w-full p-6 bg-base-100 shadow-xl mt-6 h-screen"}>

        {/* Title for Card */}
        <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>
          بانک

          {/* Top side button, show only if present */}
          {
            TopSideButtons && <div className="inline-block float-righ">{TopSideButtons}</div>
          }
        </Subtitle>

        <div className="divider mt-2"></div>

        {/** Card Body */}
        <div className='h-full w-full pb-6 bg-base-100'>
          <div className="flex flex-col mb-6">
            <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره شبا</label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <CiCreditCard2 className="w-8 h-8 text-gray-400" />
              </div>
              <input style={{ borderRadius: '5px' }} type="text" value={sheba}
                onChange={handleShebaChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره شبا" />
            </div>
            <span className='text-red-500 relative text-sm'>{shebaError ? shebaErrorMessage : ""}</span>
          </div>
          <div className="mt-6"><button className="btn bg-blue-800 hover:bg-blue-900 text-white float-right" onClick={() => addAccount()}>اتصال به حساب بانکی</button></div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Bank