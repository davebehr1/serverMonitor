import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const request = require('request');


//import registerServiceWorker from './registerServiceWorker';
var servers = ["https://cognition.dev.stackworx.cloud/api/status",
			   "https://ord.dev.stackworx.io/health",
			   "https://api.durf.dev.stackworx.io/health",
			   "https://prima.run/health",
			   "https://stackworx.io/",
			   "https://stackworx.io/"
			   ];			   
class Server extends React.Component{
	render(){
		return(
			<div className="server">
			<p>{this.props.value}</p>
			<p>{this.props.status}</p>
			</div>
			);
	}
}

class ServerRack extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			servers: servers,
			active: Array(servers.length).fill("cat")

		}
	}
	checkStatus(){
		this.state.servers.map((item,key) => 


		request.get(item).on('response',(response) => {
			if(response.statusCode === 200){
			//this.setState(active[0])
			//console.log(this.state.active);
			this.state.active[key] = "up";
			}else{
				this.state.active[key] = "down";
			}
			console.log(this.state.active);
		})
		)
	}
	renderServer(i){
		for(var i =0; i < this.state.servers.length;++i){
			return (<Server value={i}/>); 
		}
		//return (<Server value = {i}/>);
	}
	 componentDidMount() {
      setInterval(() => this.setState({ time: Date.now()}), 10000)
 	}

 	componentWillUnmount() {
 	 clearInterval(this.interval);
	}

	render(){
		return(

			<div>	
				{this.checkStatus()}
				{this.state.servers.map((item,key) => 

					<Server value={item} status= {this.state.active[key]} />
				)}

			</div>
		);
	}
}

ReactDOM.render(<ServerRack />, document.getElementById('root'));
//registerServiceWorker();
