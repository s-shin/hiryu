import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";
import * as som from "@hiryu/shogi-object-model";
import * as tree from "@hiryu/tree";

const DropzoneOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background: #eee;
  z-index: 10;
  border-radius: 3px;
`;

const DropzoneOverlayInner = styled.div`
  width: 100%;
  align-self: center;
  text-align: center;
  color: #666;
`;

interface DropzoneProps {
  onDrop(files: any[]): void;
}

const Dropzone: React.FC<DropzoneProps> = props => {
  const onDrop = useCallback(files => props.onDrop(files), []);
  const { getRootProps, isDragActive } = useDropzone({ onDrop, noKeyboard: true });

  return (
    <div {...getRootProps()}>
      {isDragActive && (
        <DropzoneOverlay>
          <DropzoneOverlayInner>
            <InsertDriveFileIcon fontSize="large" color="inherit" />
          </DropzoneOverlayInner>
        </DropzoneOverlay>
      )}
      {props.children}
    </div>
  );
}

enum RecordFormatType {
  KIF = "kif",
  SHOGIWARS = "shogiwars"
}

// TODO: define this kind of type in som.
type RecordParser = (data: string) => som.Record | Error;

const recordParsers: {
  [type: string]: RecordParser;
} = {
  [RecordFormatType.KIF]: data => som.formats.kif.parseRecord(data),
  [RecordFormatType.SHOGIWARS]: data => som.formats.shogiwars.parseRecord(data),
};

export interface LoadRecordDialogProps {
  open: boolean;
  onClose: (result?: { record: som.Record; rootGameNode: som.rules.standard.GameNode }) => void;
}

export const LoadRecordDialog: React.FC<LoadRecordDialogProps> = props => {
  const [recordFormat, setRecordFormat] = useState(RecordFormatType.KIF);
  const [recordData, setRecordData] = useState("");

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const buf = reader.result as ArrayBuffer;
      const data = new Uint8Array(buf);
      const encoding = som.formats.kif.detectEncoding(data);
      console.log({ file, encoding });
      const decoder = new TextDecoder(encoding);
      setRecordData(decoder.decode(data));
      loadRecord();
    });
    reader.readAsArrayBuffer(file);
  }

  function loadRecord() {
    const r = recordParsers[recordFormat](recordData);
    // TODO: error handling
    console.log(r);
    if (r instanceof Error) {
      return;
    }
    if (r.events.length === 0) {
      return;
    }
    let leaf = som.rules.standard.newRootGameNode();
    for (const event of r.events) {
      const next = som.rules.standard.applyEvent(leaf, event);
      leaf = tree.appendChild(leaf, next);
      if (next.violations.length > 0) {
        break;
      }
    }
    const rootGameNode = tree.getRootNode(leaf);
    {
      // TODO: remove
      const v = tree.getValue(leaf);
      console.log({
        rootGameNode,
        leaf,
        r,
        a: som.formats.usi.stringifySFEN({ nextMoveNum: v.moveNum + 1, state: v.state }),
      });
    }
    props.onClose({ record: r, rootGameNode });
  }

  return (
    <Dialog
      open={props.open}
      fullWidth
      scroll="body"
      onBackdropClick={() => props.onClose()}
    >
      <DialogTitle>Load Record</DialogTitle>
      <DialogContent>
        <Dropzone onDrop={files => loadFile(files[0])}>
          <DialogContentText>
            Input the format and the content of the record to be loaded or drag and drop the file here.
          </DialogContentText>
          <FormControl>
            <InputLabel>Format</InputLabel>
            <Select
              value={recordFormat}
              onChange={e => setRecordFormat(e.target.value as RecordFormatType)}
             >
              <MenuItem value={RecordFormatType.KIF}>Kif (.kif)</MenuItem>
              <MenuItem value={RecordFormatType.SHOGIWARS}>Shogiwars</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="load-record-dialog-record"
            label="Content"
            placeholder="開始日時：..."
            multiline
            margin="normal"
            fullWidth
            autoFocus
            InputLabelProps={{ shrink: true }}
            value={recordData}
            onChange={e => setRecordData(e.target.value)}
          />
        </Dropzone>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => props.onClose()}>
          Cancel
        </Button>
        <Button color="primary" onClick={() => loadRecord()}>
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoadRecordDialog;
