import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth)

  const userToken = localStorage.getItem("userToken") || userInfo


  // show unauthorized screen if no user is found in redux store
  if (!userToken) {
    return (
      <div className='unauthorized'>
        <h1>Unauthorized :(</h1>
        <span>
          <NavLink to='/login'>Login</NavLink> to gain access
        </span>
      </div>
    )
  }else{
    <NavLink to='/' />
  }

 
}

export default ProtectedRoute


