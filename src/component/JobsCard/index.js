import './index.css'

import {withRouter} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {FiMapPin} from 'react-icons/fi'
import {MdWork} from 'react-icons/md'

const JobsCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  const onClickJobsCard = () => {
    const {history} = props
    history.push(`/jobs/${id}`)
  }

  const onKeyDownJobsCard = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClickJobsCard()
    }
  }

  return (
    <div
      className="profile-jobs-main-container"
      onClick={onClickJobsCard}
      onKeyDown={onKeyDownJobsCard}
      role="button"
      tabIndex={0}
    >
      <div className="company-header-container">
        <img src={companyLogoUrl} alt="company logo" className="company-logo" />
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
          <h1 className="package">{packagePerAnnum}</h1>
        </div>
      </div>
      <hr />
      <div className="job-description-container">
        <h1>Description</h1>
        <p className="job-description">{jobDescription}</p>
      </div>
    </div>
  )
}

export default withRouter(JobsCard)
