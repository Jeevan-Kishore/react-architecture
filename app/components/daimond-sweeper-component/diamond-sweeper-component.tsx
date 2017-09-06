import * as React from 'react';
import {Component} from 'react';
import Event = JQuery.Event;

interface MatrixInterface{
    matrix: string[][]
}

export class DiamondSweeperComponent extends Component{
    state:MatrixInterface;

    constructor(props: any){
        super(props);
        this.state = {
            matrix : []
        }
    }
    componentDidMount () {
        this.getMatrix();
    }

    getInitialState () {
        const matrixInitState: MatrixInterface =  {
            matrix:  []
        };
        return matrixInitState;
    }

    async getMatrix(){
        const matrix = await this.replaceQuestionWithDiamonds();
        this.setState({ matrix });
    }

    async replaceQuestionWithDiamonds(){
        const questionMatrix = await this.getQuestionableMatrix(8,8);
        return questionMatrix.map((matrixRow) => {
            const randomnIndex = this.getRandomDiamondPositions(0 , 7);
            matrixRow[randomnIndex] = 'D';
            return matrixRow;
        });
    }

    getQuestionableMatrix(row:number, col:number) {
        return Array.from({
            length: row
        }, () => new Array(col).fill('?'));
    };


    getRandomDiamondPositions(min: number, max: number)
    {
        return Math.floor(Math.random()*(max - min + 1) + min);
    }

    revealCell(event: React.FormEvent<HTMLButtonElement>){
        event.preventDefault();
    }

    render(){
        return (
            <div className="matrixWrapper col-8">
                {this.state.matrix.map((row, index) => {
                    return (
                        <div key={`row-${index}`} className="row">
                            {row.map((col, index) => {
                                return (
                                    <div key={`cell-${index}`}className="col matrix-cells ">
                                        <button className="btn btn-light clickable" onClick={ (e) => this.revealCell(e) }>{col}</button>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        );
    }
}

