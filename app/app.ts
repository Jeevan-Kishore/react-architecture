/**
 * Created by jeevz on 27/08/17.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {renderBodyElement} from './components/body-element';

declare const $:any;


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import './less/app.less';

ReactDOM.render(renderBodyElement, document.getElementById('root'));