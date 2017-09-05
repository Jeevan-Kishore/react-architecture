/**
 * Created by jeevz on 27/08/17.
 */
/*Import react framework*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'es6-promise';
import 'whatwg-fetch';

import 'bootstrap/js/src/util.js' // Component used by all bootstrap js files
import 'bootstrap/js/src/collapse.js'; //import collapse to enable navbar to collapse

/*Import custom styles*/
import './scss/app.scss';

/*Import components*/
import {RenderBodyElement} from "./components/body-element";

declare const $:any;

ReactDOM.render(<RenderBodyElement />, document.getElementById('root'));