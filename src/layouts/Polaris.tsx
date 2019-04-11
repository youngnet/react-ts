import * as React from "react";

interface IState {
    loading: boolean;
    ax1: number;
    checked: boolean;
    val: string;
}

type TTuple = [string, number];
type Res = TTuple[number]; // string | number
let aaa: Res;

type ElementOf<T> = T extends Array<infer E> ? E : never;

type Tuple = [string, number];

type ToUnion = ElementOf<Tuple>; // string | number
let bbb: ToUnion;

type StateCollection = "loading" | "ax1" | "checked" | "val";

type AllProps = IState | {};

class Polaris extends React.Component<AllProps, IState> {
    public state = {
        ax1: 111,
        checked: false,
        loading: false,
        val: ""
    } as IState;

    public constructor(props: AllProps) {
        super(props);
    }

    public toggleChange = () => {
        this.setState(
            { loading: !this.state.loading, ax1: ++this.state.ax1 },
            () => {
                this.setState({ val: "124" });
            }
        );
    };

    public ssxs = (loading: boolean) => {
        this.setState({ loading });
    };

    public valueChange = (key: StateCollection, value: any): void => {
        this.setState({ [key]: value } as IState);
    };

    public render(): React.ReactNode {
        const { loading, ax1, val, checked } = this.state;
        return (
            <div>
                {loading ? <span>loading</span> : <span>show</span>}
                <button onClick={this.toggleChange}>{ax1}</button>
                <input
                    type='text'
                    value={val}
                    onChange={e => this.valueChange("val", e.target.value)}
                />
                <input
                    type='checkbox'
                    name='checkbox'
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        this.valueChange("checked", e.target.checked)
                    }
                />
            </div>
        );
    }
}

export default Polaris;
