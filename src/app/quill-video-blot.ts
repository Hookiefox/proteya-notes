import Quill from 'quill';


const BlockEmbed: any = Quill.import('blots/block/embed');


class VideoBlot extends BlockEmbed {
  
  static blotName = 'video';
  static tagName = 'video';
  
  static scope = Quill.import('parchment').Scope.BLOCK;

  
  static create(value: string): HTMLVideoElement {
    const node = super.create() as HTMLVideoElement;
    node.setAttribute('src', value);
    node.setAttribute('controls', 'true');
    node.setAttribute('width', '100%');
    node.setAttribute('style', 'display: block; margin: 5px 0;');
    return node;
  }

  
  static value(node: HTMLVideoElement): string {
    return node.getAttribute('src') || '';
  }
}

export default VideoBlot;