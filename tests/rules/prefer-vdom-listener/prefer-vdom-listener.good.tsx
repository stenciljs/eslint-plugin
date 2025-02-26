@Component({ tag: 'sample-tag' })
export class SampleTag {
  buttonClick() {
    console.log('clicked');
  }

  render() {
    return (<button onClick={() => this.buttonClick()}>test</button>);
  }
}
