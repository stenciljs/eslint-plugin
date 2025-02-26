@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Listen('click')
  buttonClick() {
    console.log('clicked');
  }

  render() {
    return (<button>test</button>);
  }
}
