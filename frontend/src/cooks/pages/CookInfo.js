import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import CookSettings from '../features/settings/cookInfo/cook_settings'

function CookInfo(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "ثبت اطلاعات غذادار"}))
      }, [])
    return(
        <CookSettings />
    )
}

export default CookInfo