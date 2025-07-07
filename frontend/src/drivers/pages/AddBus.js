import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import AddBus from '../features/settings/AddBus/add_bus'

function DriverInfo(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "ثبت اطلاعات اتوبوس"}))
      }, [])
    return(
        <AddBus />
    )
}

export default DriverInfo