export type ReadLine = (text: string) => string[];
export type ReadLineFactory = () => ReadLine;

export const newDefaultReadLine: ReadLineFactory = () => {
  let buf = Array<string>();

  return (text: string) => {
    const lines: string[] = [];
    while (text.length > 0) {
      const idx = text.indexOf("\n");
      if (idx === -1) {
        buf.push(text);
        break;
      }
      lines.push(buf.concat(text.slice(0, idx)).join(""));
      buf = [];
      text = text.slice(idx + 1);
    }
    return lines;
  };
}
