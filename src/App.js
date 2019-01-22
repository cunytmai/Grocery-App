import React, { Component } from 'react';
import './App.css';
import firebase, { auth, providerA } from './firebase.js';
//can add more providers by adding onto the brackets (make sure to export the providers)

class App extends Component {
  constructor() {
    super();
    this.state= {
      currentItem: '',
      username: '',
      items: [],
      user: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange(e) {
    this.setState ({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
  }

  componentDidMount() {
    //Keeps the user logged in upon refresh
    auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });
        }
      });

    //loads the item listed from firebase
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  //Removing an item from the list
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(providerA)
      .then((result) => {
        const user = result.user;
        console.log(user);
        this.setState({
          user
        });
      });
    }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Grocery Checklist</h1>
              {this.state.user ?
                <button onClick={this.logout}>Log Out</button>
                :
                <button onClick={this.login}>Log In</button>
              }
            </div>
        </header>

        {this.state.user ?

          <div className='container'>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} alt="profile_icon"/>
            </div>

            <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="currentItem" placeholder="Add an item to the list" onChange={this.handleChange} value={this.state.currentItem} />
                  <button>Add Item</button>
                </form>
            </section>
            <section className='display-item'>
              <div className='wrapper'>
                <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <div class="itemContainer">
                        <span>
                          <div class="itemName">{item.title}</div>
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        </span>
                      </div>
                    </li>
                  )
                })}
                </ul>
              </div>
            </section>
          </div>
          :
          <div className='wrapper'>
          <p>You must be logged in to see the potluck list and submit to it.</p>
          </div>
        }

      </div>
    );
  }
}
export default App;
