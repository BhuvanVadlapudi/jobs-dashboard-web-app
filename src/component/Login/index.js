import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isLoginValid: false,
    errorMsg: '',
  }

  componentDidMount() {
    console.log('User Account Details: ', {
      username: 'rahul',
      password: 'rahul@2021',
    })
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitFormSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    this.setState({
      isLoginValid: false,
    })
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFormFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({
      isLoginValid: true,
      errorMsg,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const api = await fetch(apiUrl, options)
    const fetchedData = await api.json()
    // console.log(fetchedData)
    if (api.ok) {
      this.onSubmitFormSuccess(fetchedData.jwt_token)
    } else {
      this.onSubmitFormFailure(fetchedData.error_msg)
    }
  }

  render() {
    const {username, password, isLoginValid, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page">
        <form className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="each-input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              placeholder="Username"
              className="form-input-element"
              id="username"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="each-input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              placeholder="Password"
              className="form-input-element"
              id="password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            onClick={this.onSubmitForm}
          >
            Login
          </button>
          {isLoginValid && <p className="err-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
