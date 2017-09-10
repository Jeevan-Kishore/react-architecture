import * as React from 'react';
import {Component} from 'react';

interface MatrixInterface{
    matrix: MatrixCell[],
    gameComplete: boolean
}

interface MatrixCell{
    displayData: string,
    clicked: boolean,
    diamondFlag: boolean
    showArrow: boolean
}

export class DiamondSweeperComponent extends Component{
    state:MatrixInterface;
    NUMBER_OF_DIAMONDS:number = 8;
    COLUMN_COUNT:number = 8;
    ROW_COUNT:number = 8;
    diamondsFound:number = 0;
    diamondsIndices: number[] = [];
    gameScore: number = 0;

    constructor(props: any){
        super(props);
        this.state = {
            matrix : [],
            gameComplete: false
        }
    }
    componentDidMount () {
        this.getMatrix();
    }

    getInitialState () {
        const matrixInitState: MatrixInterface =  {
            matrix:  [],
            gameComplete: false
        };
        return matrixInitState;
    }

    async getMatrix(){
        const matrix = await this.replaceQuestionWithDiamonds();
        this.setState({ matrix });
    }

    async replaceQuestionWithDiamonds(){
        const questionMatrix = await this.getQuestionableMatrix(this.ROW_COUNT,this.COLUMN_COUNT);
        const diamondCell:MatrixCell = {
            displayData: 'questionMarkTag',
            clicked: false,
            diamondFlag: true,
            showArrow: false
        };

        for(let diamondNumber = 0; diamondNumber < this.NUMBER_OF_DIAMONDS; diamondNumber++){
            const randomnIndex = this.getRandomDiamondPositions(0 , questionMatrix.length - 1);
            questionMatrix[randomnIndex] = diamondCell;
            this.diamondsIndices.push(randomnIndex);
        }
        console.log(this.diamondsIndices);
        return questionMatrix;
    }

    getClosest(inputArray: number[], element: number){
        let closest = Math.max.apply(null, inputArray);
        for(let i = 0; i < inputArray.length; i++){
            if(inputArray[i] >= element && inputArray[i] < closest){
                closest = inputArray[i];
            }
        }
        return closest;
    }

    getQuestionableMatrix(row:number, col:number) {
        const cellData:MatrixCell = {
            displayData: 'questionMarkTag',
            clicked: false,
            diamondFlag: false,
            showArrow: false
        };

        return new Array(row * col).fill(cellData);
    };


    getRandomDiamondPositions(min: number, max: number)
    {
        return Math.floor(Math.random()*(max - min + 1) + min);
    }

    async revealCell(event: any, incomingIndex: number){
        if(this.state.gameComplete) {
            alert(`Game complete. Score : ${this.gameScore}`);
            return;
        }
        const currentState: MatrixInterface = $.extend(true,{}, this.state); //Deep copy state object, needed to setstate after computation
        const diamondCellState: MatrixCell = {
            displayData: 'diamondMarkTag',
            clicked: true,
            diamondFlag: true,
            showArrow: false
        };
        const emptyCellState: MatrixCell = {
            displayData: '',
            clicked: true,
            diamondFlag: false,
            showArrow: false
        };

        event.preventDefault();


        await this.setState(currentState); //Setback the entire object
        if(currentState.matrix[incomingIndex].diamondFlag){
            currentState.matrix[incomingIndex] = diamondCellState;
            this.diamondsFound++;
            const diamondIndex = this.diamondsIndices.findIndex((ele) => ele === incomingIndex );
            this.diamondsIndices.splice(diamondIndex, 1);
            await this.clearPreviousArrow();
        } else{
            currentState.matrix[incomingIndex] = emptyCellState;
            await this.clearPreviousArrow();
            await this.showNearestDiamond(incomingIndex);
        }
        this.checkWinCriteria();

    }

    checkWinCriteria(){
        if(this.diamondsFound === this.NUMBER_OF_DIAMONDS){
            this.state.matrix.forEach((cell) => {
                !cell.clicked && this.gameScore++;
            });
            this.setState({gameComplete: true});
        }
    }

    async clearPreviousArrow(){
        const currentState: MatrixInterface = $.extend(true,{}, this.state);
        currentState.matrix =  await currentState.matrix.map((cell) => {
            cell.showArrow = false;
            return cell;
        });
        await this.setState(currentState);
    }

    async showNearestDiamond(currentIndex: number){
        const closestIndex = this.getClosest(this.diamondsIndices, currentIndex);
        if(!this.state.matrix[closestIndex].clicked){
            const stateClone : MatrixInterface = $.extend(true,{}, this.state);
            stateClone.matrix[closestIndex].showArrow = true;
            await this.setState(stateClone);
        }
    }

    generateCells(){
        const cells = this.state.matrix.map((cell: MatrixCell, index: number) => {
            return (
                <div key={`cell-${index}`} className={`col col-sm matrix-cells`}>
                    {cell.showArrow ? <div className="arrowTag">&nbsp;</div> : null}
                    <button className={`btn btn-light clickable ${cell.displayData}`} onClick={ (e) => this.revealCell(e, index) }>&nbsp;</button>
                </div>
            )
        });

        for(let i = 1; i < cells.length; i++){ //Loop through array to insert break points after specified number of column elements
            if(i % (this.COLUMN_COUNT + 1) === 0){
                cells.splice(i-1, 0, this.generateBreakPoint(i));
            }
        }

        return (
            <div className="row">
                {cells}
            </div>
        )
    }

    generateBreakPoint(index: number){
        return(
            <div key={`break-${index}`} className="w-100"></div>
        )
    }

    showGameAlert(){
        return (
            <div className="row justify-content-end alertBoxWrapper">
                <div className="col-sm-6">
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        Game complete. Score : {this.gameScore}
                    </div>
                </div>
            </div>
        )
    }




    render(){
        return (
            <div className="matrixWrapper col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
                {this.state.gameComplete ? this.showGameAlert() : null}
                {this.generateCells()}
            </div>
        );
    }
}

