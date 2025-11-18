import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'

import Navbar from '../Navbar'
import JobsCard from '../JobsCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    profileCardApiStatus: apiStatusConstants.initial,
    jobsDataApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsProfileData: [],
    searchValue: '',
    searchInput: '',
    selectedEmpTypeList: [],
    selectedSalaryRangeList: [],
  }

  // API Calls
  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  // Profile API Call
  getProfileData = async () => {
    this.setState({
      profileCardApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'

    try {
      const profileSectionOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }

      const profileApiResponse = await fetch(
        profileApiUrl,
        profileSectionOptions,
      )

      if (profileApiResponse.ok) {
        const fetchedProfileData = await profileApiResponse.json()
        const {profile_details: profileDetails} = fetchedProfileData
        const upadatedProfileData = {
          name: profileDetails.name,
          profileImageUrl: profileDetails.profile_image_url,
          shortBio: profileDetails.short_bio,
        }

        this.setState({
          profileDetails: upadatedProfileData,
          profileCardApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          profileCardApiStatus: apiStatusConstants.failure,
        })
      }
    } catch (err) {
      this.setState({
        profileCardApiStatus: apiStatusConstants.failure,
      })
    }
  }

  // Jobs Data API Call
  getJobsData = async () => {
    this.setState({
      jobsDataApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {
      selectedEmpTypeList,
      selectedSalaryRangeList,
      searchValue,
    } = this.state

    const params = new URLSearchParams({
      employment_type: selectedEmpTypeList.join(','),
      minimum_package: selectedSalaryRangeList.join(','),
      search: searchValue,
    })

    const profileJobsApiUrl = `https://apis.ccbp.in/jobs?${params.toString()}`
    // console.log(profileJobsApiUrl)
    try {
      const jobsProfileOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }

      const jobsProfileApiResponse = await fetch(
        profileJobsApiUrl,
        jobsProfileOptions,
      )
      const fetchedJobsData = await jobsProfileApiResponse.json()

      if (jobsProfileApiResponse.ok) {
        const {jobs} = fetchedJobsData
        const updatedJobs = jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          title: job.title,
        }))
        this.setState({
          jobsProfileData: updatedJobs,
          jobsDataApiStatus: apiStatusConstants.success,
        })
      } else {
        setTimeout(() => {
          this.setState({
            jobsDataApiStatus: apiStatusConstants.failure,
          })
        }, 1000)
      }
    } catch (error) {
      setTimeout(() => {
        this.setState({
          jobsDataApiStatus: apiStatusConstants.failure,
        })
      }, 1000)
    }
  }

  // Loader
  renderLoaderPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  // Profile Card Render
  renderSuccessfulProfileCard = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-card-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  // Failure Profile API
  renderFailureProfileCard = () => (
    <div className="failure-card-container">
      <button className="retry-btn" onClick={this.getProfileData}>
        Retry
      </button>
    </div>
  )

  profileCard = () => {
    const {profileCardApiStatus} = this.state

    switch (profileCardApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderPage()
      case apiStatusConstants.success:
        return this.renderSuccessfulProfileCard()
      case apiStatusConstants.failure:
        return this.renderFailureProfileCard()
      default:
        return 'None'
    }
  }

  renderProfileCard = () => this.profileCard()

  // Jobs Render

  renderSuccessfulJobsProfileSection = () => {
    const {jobsProfileData} = this.state

    // const updatedJobsList = jobsProfileData.filter(
    //   eachData =>
    //     eachData.title.toLowerCase().includes(searchValue) ||
    //     eachData.location.toLowerCase().includes(searchValue),
    // )
    const totalJobsData = jobsProfileData.length
    const renderJobsLayout = () =>
      jobsProfileData.map(eachJob => (
        <JobsCard key={eachJob.id} jobDetails={eachJob} />
      ))
    const renderNoJobsLayout = () => (
      <div className="no-jobs-data-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We Could not find any jobs. Try other filters.</p>
      </div>
    )
    return (
      <div className="jobs-profile-container">
        {totalJobsData > 0 ? renderJobsLayout() : renderNoJobsLayout()}
      </div>
    )
  }

  // Failure Jobs API
  renderFailureJobsProfile = () => (
    <div className="failure-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-job-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="retry-btn" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  jobsProfileCard = () => {
    const {jobsDataApiStatus} = this.state

    switch (jobsDataApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderPage()
      case apiStatusConstants.success:
        return this.renderSuccessfulJobsProfileSection()
      case apiStatusConstants.failure:
        return this.renderFailureJobsProfile()
      default:
        return 'None'
    }
  }

  renderJobsProfileCard = () => this.jobsProfileCard()

  searchBar = () => {
    const onChangeSearchValue = event => {
      this.setState({
        searchInput: event.target.value.toLowerCase(),
      })
    }

    const triggerSearchBar = () => {
      this.setState(
        prevState => ({
          searchValue: prevState.searchInput,
        }),
        this.getJobsData,
      )
    }

    const onClickEnterSearchBar = event => {
      if (event.key === 'Enter') {
        triggerSearchBar()
      }
    }

    return (
      <div className="search-bar-container">
        <input
          type="search"
          placeholder="Search"
          onKeyDown={onClickEnterSearchBar}
          onChange={onChangeSearchValue}
          className="job-search-bar"
        />
        <button
          className="search-icon-container"
          onClick={triggerSearchBar}
          data-testid="searchButton"
        >
          <FaSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onToggleEmpType = event => {
    const {value, checked} = event.target
    if (checked) {
      this.setState(
        prevState => ({
          selectedEmpTypeList: [...prevState.selectedEmpTypeList, value],
        }),
        this.getJobsData,
      )
    } else {
      const {selectedEmpTypeList} = this.state
      const updatedEmpTypeList = selectedEmpTypeList.filter(
        eachEmpType => eachEmpType !== value,
      )
      this.setState(
        {
          selectedEmpTypeList: updatedEmpTypeList,
        },
        this.getJobsData,
      )
    }
  }

  onToggleSalaryRange = event => {
    const {value, checked} = event.target

    this.setState(prevState => {
      if (checked) {
        return {
          selectedSalaryRangeList: [
            ...prevState.selectedSalaryRangeList,
            value,
          ],
        }
      }
      return {
        selectedSalaryRangeList: prevState.selectedSalaryRangeList.filter(
          eachSalaryRange => eachSalaryRange !== value,
        ),
      }
    }, this.getJobsData)
  }

  leftMenubar = () => {
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <div className="profile-filter-container">
        {this.renderProfileCard()}
        <hr color="white" />
        <h1 className="label-header">Type of Employment</h1>
        {employmentTypesList.map(eachEmpType => (
          <div
            className="each-emp-type-container"
            key={eachEmpType.employmentTypeId}
          >
            <input
              type="checkbox"
              id={eachEmpType.employmentTypeId}
              className="emp-type-checkbox"
              value={eachEmpType.employmentTypeId}
              onChange={this.onToggleEmpType}
            />
            <label
              className="each-emp-type-label"
              htmlFor={eachEmpType.employmentTypeId}
            >
              {eachEmpType.label}
            </label>
          </div>
        ))}
        <hr color="white" />
        <h1 className="label-header">Salary Range</h1>
        {salaryRangesList.map(eachSalaryRange => (
          <div
            className="each-emp-type-container"
            key={eachSalaryRange.salaryRangeId}
          >
            <input
              type="checkbox"
              id={eachSalaryRange.salaryRangeId}
              className="emp-type-checkbox"
              value={eachSalaryRange.salaryRangeId}
              onChange={this.onToggleSalaryRange}
            />
            <label
              className="each-emp-type-label"
              htmlFor={eachSalaryRange.salaryRangeId}
            >
              {eachSalaryRange.label}
            </label>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="jobs-main-container">
          <div className="searchbar-container-mobile">{this.searchBar()}</div>
          <div className="left-menubar-container">{this.leftMenubar()}</div>
          <div className="profile-jobs-container">
            <div className="searchbar-container-desktop">
              {this.searchBar()}
            </div>
            <div>{this.renderJobsProfileCard()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
