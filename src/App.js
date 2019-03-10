import React, { Component } from 'react';
//import Clarifai from 'clarifai'; moved to backend
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

/** Moved to backend
const app = new Clarifai.App({
 apiKey: '0ecd76d27bbf43aa84f94cfb2e7140ba'
});
*/
const particlesOptions = {
    particles: {
        number: {
          value: 70,
          density: {
            enable: true,
            value_area: 800
          }
       } 
    },
  interactivity:{
     detect_on:"canvas",
     events:{
      onhover:{
        enable:true, mode:"repulse"},
      onclick:{
        enable:true, mode:"push"},
      resize:true
    },
    modes:{
      repulse:{distance:200,duration:0.4 },
        push:{
          particles_nb:4 },
        remove:{ particles_nb:2 }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: '',
      route:'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }
loadUser = (data)=>{
  this.setState({user:{
    id: data.id,
    name: data.name,
    email: data.email,
   // password: '',
    entries: data.entries,
    joined: data.joined
  }})
}


calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  //console.log(box);
  this.setState({box: box});
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onPictureSubmit = () => {
  this.setState({imageUrl: this.state.input});
 /** Moved to backend
  app.models.predict(
    Clarifai.FACE_DETECT_MODEL, 
    this.state.input)*/
  fetch('http://localhost:3000/imageUrl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input:this.state.input
      })
    })
 .then(response => response.json())
  .then(response => {
    if (response) {
      fetch('http://localhost:3000/image',{
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({  
          id:this.state.user.id 
        })
     })
      .then(response=>response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user,{ entries:count})
          //The code to update count below throws an error(undefined for name in app) use Object.assign instead!
        /*  {user: 
            {entries : count}
          }*/
        )
      })
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
  .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route ==='signout') {
    this.setState(initialState)
    route = 'signin'
  } else if (route === 'home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route: route});
}

  render() {
   const  {isSignedIn, imageUrl, route, box, user} = this.state;
    return (
      <div className="App " >
      <Particles className="particles"
                params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
        ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm 
            onInputChange = {this.onInputChange}
            onPictureSubmit = {this.onPictureSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        :(
          route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange ={this.onRouteChange}/> 
          : <Register loadUser={this.loadUser} onRouteChange ={this.onRouteChange}/> 
          )       
        }
      </div>
    );
  }
}

export default App;
