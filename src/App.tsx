import * as React from "react";
import "./App.css";
import Polaris from "./layouts/Polaris";

import logo from "./logo.svg";

class App extends React.Component {
    constructor(props: object) {
        super(props);
        this.state = {};
    }
    public render() {
        return (
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>Welcome to React</h1>
                </header>
                <p className='App-intro'>
                    To get started, edit <code>src/App.tsx</code> and save to
                    reload.
                </p>
                <Polaris />
            </div>
        );
    }

    public componentWillMount() {
        this.setState({ a: 1 });
    }
}

export default App;
