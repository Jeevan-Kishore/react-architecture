import * as React from 'react';

import {CodeNavBar} from './nav-bar/code-nav-bar';
import {Component} from 'react';
import {DiamondSweeperComponent} from './daimond-sweeper-component/diamond-sweeper-component';

export class RenderBodyElement extends Component{
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
                    <DiamondSweeperComponent/>
                </div>
            </div>
        );
    }
}

