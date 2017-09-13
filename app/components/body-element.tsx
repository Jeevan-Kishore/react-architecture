import * as React from 'react';
import { Switch, Route } from 'react-router-dom'
import {CodeNavBar} from './nav-bar/code-nav-bar';
import {DiamondSweeperComponent} from './daimond-sweeper-component/diamond-sweeper-component';
import {Home} from "./home-component/home";

export class RenderBodyElement extends React.Component{
    constructor(props: any){
        super(props);
    }
    componentDidMount () {

    }

    render(){
        return (
            <div className='parent-div container-fluid'>
                <CodeNavBar />
                <div className="row justify-content-md-center">
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/diamond-sweeper' component={DiamondSweeperComponent}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

