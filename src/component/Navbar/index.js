import './index.css'

import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai' // Home icon (Ant Design)
import {MdWork} from 'react-icons/md' // Jobs icon (Material)
import {FiLogOut} from 'react-icons/fi' // Logout icon (Feather)

const Navbar = props => {
  const onLogoutButton = () => {
    Cookies.remove('jwt_token')

    const {history} = props
    history.replace('/login')
  }
  return (
    <>
      <nav className="nav-main-container">
        <ul className="navbar-container navbar-container-large-screens">
          <li>
            <Link to="/">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="logo-img"
              />
            </Link>
          </li>

          <li>
            <ul className="nav-link-items-container">
              <li>
                <Link to="/" className="link-item">
                  <p className="nav-item-text">Home</p>
                  <AiFillHome className="link-item-img" />
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="link-item">
                  <p className="nav-item-text">Jobs</p>
                  <MdWork className="link-item-img" />
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <button
              className="logout-btn"
              type="submit"
              onClick={onLogoutButton}
            >
              <p className="nav-item-text">Logout</p>
              <FiLogOut className="link-item-img" />
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Navbar)
