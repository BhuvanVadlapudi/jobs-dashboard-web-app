import './index.css'

import {Component} from 'react'
import {Link} from 'react-router-dom'

import Navbar from '../Navbar'

class Home extends Component {
  onFindJobs = () => {
    // const {history} = this.props
    // history.push('/jobs')
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-main-text">
              Find The Job That
              <br />
              Fits Your Life
            </h1>
            <p className="home-description">
              Millions of people are searching for jobs, salary information,
              company reviews. Find jobs that fits your abilities and potential.
            </p>
            <Link to="/jobs" className="find-jobs-btn-element">
              <button className="find-jobs-btn" onClick={this.onFindJobs}>
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
