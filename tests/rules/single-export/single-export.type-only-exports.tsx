export interface SampleTagProps {
  label: string;
}
export type SampleTagVariant = 'primary' | 'secondary';

@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}
