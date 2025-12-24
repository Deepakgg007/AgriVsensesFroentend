 
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavMenu from './menu/NavMenu'
import useSticky from '../../hooks/use-sticky'
import Offcanvas from '../../components/common/Offcanvas'
import SearchBar from '../../components/common/SearchBar'

export default function HeaderTwo() {

	const { sticky } = useSticky()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [serchOpen, setSearchOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsAuthenticated(true)
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    navigate('/login')
  }



  return (
    <>
      <header id="header-sticky" className={`header-2 ${sticky ? "sticky" : ""}`}>
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <Link to="/" className="header-logo">
                    <img src="assets/img/logo/logo.png" alt="logo-img" />
                  </Link>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="mean__menu-wrapper d-none d-xl-block">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                       <NavMenu />
                    </nav>
                  </div>
                </div>
                <div className="search-adjust">
                  <a style={{cursor: "pointer"}} className="search-trigger d-center" onClick={() => setSearchOpen(!serchOpen)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </a>

                  {isAuthenticated && (
                    <>
                      <Link to="/profile" className="d-center mx-3" style={{fontSize: '20px', color: '#1f4e3d'}} title="My Profile">
                        <i className="fa-solid fa-user-circle"></i>
                      </Link>

                      {user && user.kycStatus !== 'verified' && (
                        <Link to="/kyc-update" className="d-center mx-2" style={{fontSize: '18px', color: '#ff9800'}} title="Complete KYC">
                          <i className="fa-solid fa-exclamation-triangle"></i>
                        </Link>
                      )}
                    </>
                  )}

                  <div className="header-button d-sm-block d-none">
                    {isAuthenticated ? (
                      <button onClick={handleLogout} className="cmn-btn round100">
                        Logout
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      </button>
                    ) : (
                      <Link to="/login" className="cmn-btn round100">
                        Login
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle" onClick={() => setOpen(!open)}>
                    <i className="fas fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Offcanvas open={open} setOpen={setOpen} />
      <SearchBar serchOpen={serchOpen} setSearchOpen={setSearchOpen} />


    </>
  )
}
