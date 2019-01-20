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
	render(){
		return(
			<div className="server" value = {this.props.status} onClick = {() => this.props.onClick()}>
			<p>{this.props.value}</p>
			<p>{this.props.status}</p>
			{this.props.previous === null ? 
				(<p> no previous response</p>) : (<p>Last response {this.props.previous}</p>)}
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
	 //console.log("checking health");
	
 	}

 	handleClick(i){
 		if(this.state.history.length < 2){
 			return;
 		}

 		this.setState((previousState) => {
 			const history = previousState.history.slice();
 			const newPrevious = previousState.prev.slice();

 			newPrevious[i] = history[history.length-2].servers[i];
 			return {'prev' : newPrevious};
 		});
 		alert(i);


 	}

	 pushHistory() {
	 	const prev = this.state.active.slice();
	    const history = this.state.history.slice();
	    // const current =  history[history.length - 1];
	    // const servers = current.servers.slice();
	    // console.log("SERVERS: " + servers);
	    this.setState({
	      history: history.concat([{
	        servers: prev
	      }])
	    });
	  }

	render(){
			
		return(

			<div className="serverRack">	
				{this.state.urls.map((item,key) => 
					<Server value={item} onClick = {() => this.handleClick(key)} status= {this.state.active[key]} previous = {this.state.prev[key]}/>
				)}

			</div>
		);
	}
}

ReactDOM.render(<ServerRack />, document.getElementById('root'));
//registerServiceWorker();
