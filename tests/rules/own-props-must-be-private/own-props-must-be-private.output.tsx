@Component({ tag: 'sample-tag' })
export class SampleTag {
  private internalProp: string;

  private internalProp2 = 1;

  @OwnDecorator()
  private internalDecoratedProp: string;

  @OwnDecorator()
  private internalDecoratedProp2: string;

  @Prop() readonly test?: string;

  @Prop({ mutable: true }) testMutable?: string;


  render() {
    return (<div>test</div>);
  }
}
