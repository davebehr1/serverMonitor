import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const request = require('request');


//import registerServiceWorker from './registerServiceWorker';
var servers = ["https://cognition.dev.stackworx.cloud/api/status",
			   "https://ord.dev.stackworx.io/health",
			   "https://api.durf.dev.stackworx.io/health",
			   "https://prima.run/health",
			   "https://stackworx.io/"
			   ];			   
class Server extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			upTime: 0,
			displayPrevious: false
		};
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount(){
		//if(this.props.status === "up"){
		const startTime = Date.now() - this.state.upTime;
		this.timer = setInterval(() =>{
			this.setState({upTime: Date.now() - startTime});
		});
		//}

	}
	componentDidUpdate(){
		if(this.props.status === "down"){
			clearInterval(this.timer);
			//this.setState({upTime: this.state.upTime - 30000})
		}
		if(this.props.previous === "down" && this.props.status === "up"){
			console.log("GOOOOOOOOOOOOAAAAAAAAAAAAAAAAALLLLLLLLLLL");
			const startTime = Date.now() - this.state.upTime;
			this.timer = setInterval(() =>{
			this.setState({upTime: Date.now() - startTime});
		});
		}

	}

	handleClick(){
		this.setState({
			displayPrevious: !this.state.displayPrevious
		});
	}
	render(){
		return(
			<div className="server" value = {this.props.status} onClick = {this.handleClick}>
			<h3>Server: <br /> {this.props.value}</h3>
			<div className="statusBar" value = {this.props.status}>{this.props.status}</div>
			{this.state.displayPrevious === true && this.props.previous != null ?
				(<p>Last response {this.props.previous}</p>) : (<p> no previous response </p>) }

			<p>upTime : {milliToMinutes(this.state.upTime)}</p>
			</div>
			);
	}
}

class ServerRack extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			history: [{
				servers: Array(servers.length).fill(null),
			}],
			urls: servers,
			prev:Array(servers.length).fill(null),
			active: Array(servers.length).fill(null)

		}
	}
	checkStatus(){
		this.state.urls.map((item,key) => 


		request.get(item).on('response',(response) => {
		
			let activeCopy = this.state.active.slice();
	
			if(response.statusCode === 200){
			

			activeCopy[key] = "up";
			this.setState({
				active: activeCopy
			});
			//this.state.active[key] = "up";
			}else{
				activeCopy[key] = "other";
				this.setState({
				active: activeCopy
				});
			}
			console.log(this.state.active);
		}).on('error',(err) =>{
			let activeCopy = this.state.active.slice();
			//let activeCopyTwo = this.state.active;
			activeCopy[key] = "down";
			console.log("error");
			this.setState({
				active: activeCopy
			});
			console.log("error");
		})
		)
		this.pushHistory();

		// this.setState((prevState) => {
  //     		const newHistory = prevState.history.slice();
  //     		console.log("NEW HISTORY: " + newHistory);
  //     	});

		setTimeout(function(){
      		this.checkStatus();
   		 }.bind(this), 30000);

	}
	 componentDidMount() {
	 this.checkStatus(); 	
	 console.log("checking health");
	
 	}

 	componentDidUpdate(){
 		//console.log("Component updated");
 	}

 	pushPrevious(){
 		if(this.state.history.length < 2){
 			return;
 		}
 		const newHistory = this.state.history.slice();
 		console.log(newHistory[this.state.history.length -2].servers);
 		this.setState({'prev' : newHistory[this.state.history.length -1].servers});
 	}

	 pushHistory() {
	 	const prev = this.state.active.slice();
	    const history = this.state.history.slice();
	    this.setState({
	      history: history.concat([{
	        servers: prev
	      }])
	    }, () => console.log("hey there"), this.pushPrevious());
	  }

	render(){
			
		return(

			<div className="serverRack">	
				{this.state.urls.map((item,key) => 
					<Server value={item} status= {this.state.active[key]}
					 previous = {this.state.prev[key]}/>
				)}

			</div>
		);
	}
}

function milliToMinutes(millis){
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + " : " + (seconds < 10 ? '0' : '') + seconds; 
}

ReactDOM.render(<ServerRack />, document.getElementById('root'));
//registerServiceWorker();
