import React, {Component} from 'react';
import './App.css';
import 'shoelace-css/dist/shoelace.css';
import request from 'superagent'

class Register extends Component {
    constructor () {
        super()
        this.state = {
            username: '',
            password: '',
            email: ''
        }
    }

    handleChange = (event) => {
      const { value } = event.target
      const name = event.target.name
      this.setState({
        [name]: value
      })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        request
          .post('https://whispering-stream-62515.herokuapp.com/api/v1/users')
          .set('X-Requested-With', 'XMLHttpRequest')
          .send({
            username: this.state.username,
            password: this.state.password,
            email_address: this.state.email
          })
          .then(res => {
            this.props.sendToLogin()
          })
    }

    render () {
    return (
        <div className='Register'>
        <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
              <div className="input-field">
                  <label>Name</label>
                  <input name="username" value={this.state.username} onChange={this.handleChange} type="text"/>
              </div>

              <div className="input-field">
                  <label>Password</label>
                  <input name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
              </div>

              <div className="input-field">
                  <label>Email</label>
                  <input name="email" value={this.state.email} onChange={this.handleChange} type="email"/>
              </div>

              <button type="submit" className="button">Register</button>
              <button className='button-danger' onClick={this.props.cancel}>Cancel</button>
            </form>
        </div>
    )
    }
}

export default Register