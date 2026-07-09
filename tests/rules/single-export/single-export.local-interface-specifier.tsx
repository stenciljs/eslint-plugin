interface SampleTagProps {
  label: string;
}

@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export { SampleTagProps };
