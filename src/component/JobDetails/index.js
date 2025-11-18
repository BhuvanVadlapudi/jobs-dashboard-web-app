import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {FiMapPin, FiExternalLink} from 'react-icons/fi'
import {MdWork} from 'react-icons/md'

import Navbar from '../Navbar'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobId: '',
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsCardApiOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const jobUrl = `https://apis.ccbp.in/jobs/${id}`

    const fetchJobUrl = await fetch(jobUrl, jobDetailsCardApiOptions)
    console.log(fetchJobUrl.ok)
    if (fetchJobUrl.ok) {
      const fetchedJobResponse = await fetchJobUrl.json()
      const {
        job_details: jobDetails,
        similar_jobs: similarJobs,
      } = fetchedJobResponse
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      const updatedSimilarJobs = similarJobs.map(eachJobDetail => ({
        companyLogoUrl: eachJobDetail.company_logo_url,
        employmentType: eachJobDetail.employment_type,
        id: eachJobDetail.id,
        jobDescription: eachJobDetail.job_description,
        location: eachJobDetail.location,
        rating: eachJobDetail.rating,
        title: eachJobDetail.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      setTimeout(() => {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }, 1000)
    }
  }

  similarJobsCard = eachSimilarJob => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
    } = eachSimilarJob
    return (
      <li className="profile-jobs-main-container" key={id}>
        <div className="company-header-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="company-name-details">
            <h1 className="company-name">{title}</h1>
            <div className="rating-container">
              <AiFillStar color="#fbbf24" size={30} />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="company-details-container">
          <div className="location-container">
            <div className="work-location-container">
              <FiMapPin color="white" size={18} />
              <p className="location-name">{location}</p>
            </div>
            <div className="work-emp-type-container">
              <MdWork color="white" size={18} />
              <p className="j">{employmentType}</p>
            </div>
          </div>
        </div>
        <div className="job-description-container">
          <h1>Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    )
  }

  renderSuccessJobDetailsCard = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="job-details-main-container">
        <div className="profile-jobs-main-container">
          <div className="company-header-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="company-name-details">
              <h1 className="company-name">{title}</h1>
              <div className="rating-container">
                <AiFillStar color="#fbbf24" size={30} />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="company-details-container">
            <div className="location-container">
              <div className="work-location-container">
                <FiMapPin color="white" size={18} />
                <p className="location-name">{location}</p>
              </div>
              <div className="work-emp-type-container">
                <MdWork color="white" size={18} />
                <p className="j">{employmentType}</p>
              </div>
            </div>
            <div className="package-contianer">
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="job-description-container">
            <div className="job-description-header">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} className="company-website-url">
                Visit
                <FiExternalLink size={20} color="#4f46e5" />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1>Skills</h1>
            <ul className="skills-list-container">
              {skills?.map(eachSkill => (
                <li
                  key={`${eachSkill.name}-${eachSkill.image_url}`}
                  className="each-skill-list"
                >
                  <img
                    src={eachSkill.image_url}
                    className="skill-img"
                    alt={eachSkill.name}
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-container">
            <h1>Life At Company</h1>
            <div className="life-at-company-desc-container">
              <p>{lifeAtCompany?.description}</p>
              <img
                src={lifeAtCompany?.image_url}
                className="life-at-company-img"
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobs?.map(eachSimilarJob =>
              this.similarJobsCard(eachSimilarJob),
            )}
          </ul>
        </div>
      </div>
    )
  }

  // Loader
  renderLoaderPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  renderFailureJobDetailsCard = () => (
    <div className="failure-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-job-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="retry-btn" onClick={this.getJobDetailsData}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsCard = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderPage()
      case apiStatusConstants.success:
        return this.renderSuccessJobDetailsCard()
      case apiStatusConstants.failure:
        return this.renderFailureJobDetailsCard()
      default:
        return 'None'
    }
  }

  render() {
    return (
      <>
        <Navbar />
        {this.renderJobDetailsCard()}
      </>
    )
  }
}

export default JobDetails
