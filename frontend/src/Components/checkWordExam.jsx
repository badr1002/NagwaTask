import React, { Component } from 'react';



// cahange backgroundColor for select button 
export const getSelectButtonStyle = (backgroundColor, status) => {
    if (status === "change") {
        return `
             background-color: ${backgroundColor};
                color: white;
                border: 1px solid;
                font-size: 18px;
                padding: 12px;
                border-radius: 10px;
                margin: 10px;
                cursor: pointer;
                font-weight: 600;
            `
    }
    return {
        'color': 'white',
        'backgroundColor': backgroundColor,
        'border': '1px solid',
        'fontSize': '18px',
        'padding': '12px',
        'borderRadius': '10px',
        'margin': '10px',
        'cursor': 'pointer',
        'fontWeight': '600'
    }
}

export const initialState = {
    currentStep: 1,
    questions: [],
    selectedItems: [],
    disabled: false,
    nextButnStatus: true,
    submitButnStatus: true,
    tryAgainButnStatus: true,
    totalScoure: 0,
    progressScoure: 0,
    selectBtnStyle: getSelectButtonStyle('rgb(122 139 122)')
}

class CheckWordExam extends Component {
    constructor(props) {
        super(props)
        this.state = initialState
        this.getData()

    }

    // get 10 questions from database
    getData() {
        this.componentDidMount = () => {
            fetch('/api/words/getRondonmWordList', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    this.setState({ questions: res.data })
                }
            });
        }
    }

    // update state to next Selection
    _next = () => {
        let currentStep = this.state.currentStep
        if (currentStep === this.state.questions.length) {
            return this.setState({
                currentStep: currentStep,
                disabled: true,
                nextButnStatus: true,
                submitButnStatus: false
            })
        }
        currentStep = currentStep >= this.state.questions.length ? this.state.questions.length : currentStep + 1
        this.setState({
            currentStep: currentStep,
            disabled: false,
            nextButnStatus: true
        })
        let selectors = [...document.querySelectorAll('.select')]
        selectors.map(x => x.setAttribute('style', getSelectButtonStyle(' rgb(122 139 122)', 'change')))
    }

    // return next button 
    get nextButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not more than questions size, then render the "next" button
        if (currentStep < this.state.questions.length + 1) {
            return (
                <button
                    className="btn btn-primary float-right m-2"
                    type="button"
                    disabled={this.state.nextButnStatus}
                    style={{ 'display': !this.state.submitButnStatus ? 'none' : 'inline' }}
                    onClick={this._next}>
                    Next
                </button>
            )
        }
        return null;
    }

    // Add the Selection to state and check if is currect 
    handleSelected = (obj, selectedItem) => {
        const _selectedItems = [...this.state.selectedItems]
        // add new element have id and pos to selectedItems
        let _obj = Object.assign(obj, { "class": obj.id + selectedItem.toLowerCase() })
        _selectedItems.push(_obj)
        this.setState({ selectedItems: _selectedItems, disabled: true, nextButnStatus: false })
        let progressScoure = this.state.progressScoure
        progressScoure++
        this.setState({ progressScoure })
        // check if the Selection is currect
        if (obj.pos !== selectedItem.toLowerCase()) {
            return this.handelCheckAnsswer(false, _obj)
        }
        return this.handelCheckAnsswer(true, _obj)

    }

    // if the Selection is currect change select button background color to green else red
    handelCheckAnsswer = (status, _obj) => {
        let selectBtn = document.getElementById(_obj.class)
        if (status) {
            selectBtn.setAttribute('style', getSelectButtonStyle(' #0a9b0a', 'change'))
        } else {
            selectBtn.setAttribute('style', getSelectButtonStyle(' #cf0606', 'change'))
        }

    }

    handleSubmit = event => {
        event.preventDefault()
        fetch('/api/words/checkWords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 'wordList': this.state.selectedItems })
        }).then(res => res.json()).then(res => {
            if (res.success) {
                this.setState({ totalScoure: res.data.result })
                this.setState({ tryAgainButnStatus: false })
            }
        });

    }

    handleReastTask = () => {
        this.setState(initialState)
        this.getData()
    }


    render() {
        if (this.state.currentStep < 1 || this.state.questions.length === 0) {
            return null
        }
        return (
            <React.Fragment>
                <div className="text-center">
                    <h1>Words type Exam 🧙‍♂️</h1>
                    <p>Step {this.state.currentStep} </p>
                    <Step
                        currentStep={this.state.currentStep}
                        handleSelected={this.handleSelected}
                        state={this.state}
                        disabled={this.state.disabled}
                        nextButton={this.nextButton}
                        previousButton={this.previousButton}
                        selectBtnStyle={this.state.selectBtnStyle}

                    />
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{ width: this.state.progressScoure / 10 * 100 + '%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                    </div>

                    {this.nextButton}
                    <button className='btn btn-success m-2' style={{ display: !this.state.submitButnStatus ? 'inline' : 'none' }} onClick={this.handleSubmit}>Submit</button>
                    <button className='btn btn-warning m-2' style={{ display: !this.state.tryAgainButnStatus ? 'inline' : 'none' }} onClick={this.handleReastTask}>Try Again</button>
                </div>
                <p style={{ display: this.state.totalScoure > 0 ? 'inline' : 'none' }} className='alert alert-info m-5'>You Scourd {this.state.totalScoure}%</p>
            </React.Fragment >
        );
    }


}

// create The task step componetnt
export const Step = (props) => {
    let i = props.currentStep - 1
    let item = props.state.questions[i]
    return (
        <div className="form-group ">
            <h1 >Chose the currect answer</h1>
            <h1 className='alert alert-light'>What type of word is this <strong>"{props.state.questions[i].word}"</strong> ?</h1>
            <button id={item.id + 'noun'} style={props.selectBtnStyle} className='select' disabled={props.disabled} onClick={() => { props.handleSelected(item, 'Noun') }}>Noun</button>
            <button id={item.id + 'verb'} style={props.selectBtnStyle} className='select' disabled={props.disabled} onClick={() => { props.handleSelected(item, 'Verb') }}>Verb</button>
            <button id={item.id + 'adverb'} style={props.selectBtnStyle} className='select' disabled={props.disabled} onClick={() => { props.handleSelected(item, 'Adverb') }}>Adverb</button>
            <button id={item.id + 'adjective'} style={props.selectBtnStyle} className='select' disabled={props.disabled} onClick={() => { props.handleSelected(item, 'Adjective') }}>Adjective</button>
        </div>
    );


}

export default CheckWordExam;
