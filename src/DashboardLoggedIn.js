import React, { Component } from 'react'
import './App.css'
import 'shoelace-css/dist/shoelace.css'
import Question from './Question'
import request from 'superagent'
import AskQuestionForm from './AskQuestionForm'
import Profile from './Profile'

class DashboardLoggedIn extends Component {
  constructor () {
    super()
    this.state = {
      questions: [],
      askQuestion: false,
      profileClicked: false,
      searchValue: ''
    }

    this.askQuestionForm = this.askQuestionForm.bind(this)
    this.getQuestions = this.getQuestions.bind(this)
    this.submitOrCancel = this.submitOrCancel.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.clickProfile = this.clickProfile.bind(this)
    this.closeProfile = this.closeProfile.bind(this)
    this.addNewQuestion = this.addNewQuestion.bind(this)
  }

  addNewQuestion (res) {
    this.setState({
      questions: this.state.questions.concat(res)
    })
  }

  submitOrCancel () {
    this.setState({
      askQuestion: false
    })
  }

  closeProfile () {
    this.setState({
      profileClicked: false
    })
  }

  componentDidMount () {
    request
      .get('https://whispering-stream-62515.herokuapp.com/api/v1/questions')
      .then(res => {
        // console.log(res)
        this.setState({
          questions: res.body.questions
        })
        this.getQuestions(res.body.next)
      })
  }

  handleSearch (event) {
    this.setState({
      searchValue: event.target.value
    })
  }

  askQuestionForm () {
    this.setState({
      askQuestion: true
    })
  }

  clickProfile () {
    this.setState({
      profileClicked: true
    })
  }

  getQuestions (next) {
    request
      .get(`https://whispering-stream-62515.herokuapp.com/api/v1${next}`)
      .then(res => {
        this.setState({
          questions: this.state.questions.concat(res.body.questions)
        })
        if (res.body.next) {
          this.getQuestions(res.body.next)
        }
      })
  }

  render () {
    if (this.state.askQuestion) {
      return (
        <div>
          <header className='header'>
            <h1 className='title'>code{'{interview}'}</h1>
          </header>
          <div>
            <AskQuestionForm submitOrCancel={this.submitOrCancel} addNewQuestion={this.addNewQuestion} />
          </div>
        </div>
      )
    } else if (this.state.searchValue) {
      const filteredArray = this.state.questions.filter(question => question.title.toLowerCase().includes(this.state.searchValue.toLowerCase()))
      return (
        <div>
          <header className='header'>
            <h1 className='title'>code{'{interview}'}</h1>
            <button className='profileButton button-light' onClick={this.clickProfile}>Your Account</button>
          </header>
          <div className='input-group'>
            <span className='input-addon input-addon-xl'>Q:</span>
            <input type='text'className='input-xl searchBar' placeholder='search...' onChange={this.handleSearch} />
          </div>
          <div className='askQ'>
            <button className='button-light' onClick={this.askQuestionForm} >Ask a question!</button>
          </div>
          <div className='questions-container'>
            {filteredArray.map((question, idx) => (
              <div key={idx}>
                <Question question={question} />
              </div>
            ))}
          </div>
        </div>
      )
    } else if (this.state.profileClicked) {
      return (
        <div>
          <header className='header'>
            <h1 className='title'>code{'{interview}'}</h1>
          </header>
          <Profile updateToken={this.props.updateToken} profileState={this.closeProfile} />
        </div>
      )
    } else {
      return (
        <div className='Dashboard'>
          <header className='header'>
            <h1 className='title'>code{'{interview}'}</h1>
            <button className='profileButton button-light' onClick={this.clickProfile}>Your Account</button>
          </header>
          <div className='input-group'>
            <span className='input-addon input-addon-xl'>Q:</span>
            <input className='searchBar input-xl' type='text' placeholder='search...' onChange={this.handleSearch} />
          </div>
          <div className='askQ'>
            <button className='button-block button-light askQ' onClick={this.askQuestionForm} >Ask a question!</button>
          </div>
          <div className='questions-container'>
            {this.state.questions.map((question, idx) => (
              <div key={idx}>
                <Question question={question} />
              </div>
            ))}
          </div>
        </div>
      )
    }
  }
}

export default DashboardLoggedIn
