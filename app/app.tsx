/*Import react framework*/
import * as React from 'react';
import {render} from 'react-dom';

import 'es6-promise';
import 'whatwg-fetch';

import 'bootstrap/js/src/util.js' // Component used by all bootstrap js files
import 'bootstrap/js/src/collapse.js'; //import collapse to enable navbar to collapse
import 'bootstrap/js/src/alert.js' //Import alert bootstrap plugin

/*Import custom application styles*/
import './scss/main.scss';

/*Import components*/
import {RenderBodyElement} from "./components/body-element";

import {BrowserRouter} from 'react-router-dom';



render(<BrowserRouter>
    <RenderBodyElement />
</BrowserRouter>,
    document.getElementById('root'));