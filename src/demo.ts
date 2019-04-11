import * as React from "react";

interface IState {
    a: number;
    b: number;
}

class App extends React.Component<{}, IState> {
    public readonly state = {
        a: 1213,
        b: 2894
    };

    // readonly state = {} as IState,断言全部为一个值

    public componentDidMount() {
        this.state.a = 131234;
        // 正确的使用了 ts 泛型指示了 state 以后就会有正确的提示
        // error: '{ c: number }' is not assignable to parameter of type '{ a: number, b: number }'
        this.setState({
            b: 3
        });
    }
    // ...
}

export default App;
