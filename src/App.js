import './App.css'

import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './component/Login'
import Home from './component/Home'
import Jobs from './component/Jobs'
import NotFound from './component/NotFound'
import JobDetails from './component/JobDetails'
import ProtectedRoute from './component/ProtectedRoute'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

// Replace your code here
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute
          exact
          path="/jobs"
          render={props => (
            <Jobs
              {...props}
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
            />
          )}
        />
        <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}
export default App
