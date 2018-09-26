import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Dropzone from "react-dropzone";
import styled from "styled-components";
import * as som from "@hiryu/shogi-object-model";
import { newRootGameNode, applyEvent } from "../utils/game";

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

export interface LoadRecordDialogProps {
  open: boolean;
  onClose: (result?: { record: som.Record; rootGameNode: som.rules.standard.GameNode }) => void;
}

export interface LoadRecordDialogState {
  recordData: string;
  isDropzoneActive: boolean;
}

class LoadRecordDialog extends React.Component<LoadRecordDialogProps, LoadRecordDialogState> {
  state = {
    recordData: "",
    isDropzoneActive: false,
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        fullWidth
        scroll="body"
        onBackdropClick={() => this.props.onClose()}
      >
        <DialogTitle>Load Record</DialogTitle>
        <DialogContent>
          <Dropzone
            disableClick
            style={{ position: "relative" }}
            onDrop={files => {
              this.setIsDropzoneActive(false);
              this.loadFile(files[0]);
            }}
            onDragEnter={() => this.setIsDropzoneActive(true)}
            onDragLeave={() => this.setIsDropzoneActive(false)}
          >
            {this.state.isDropzoneActive && (
              <DropzoneOverlay>
                <DropzoneOverlayInner>
                  <InsertDriveFileIcon fontSize="large" color="inherit" />
                </DropzoneOverlayInner>
              </DropzoneOverlay>
            )}
            <DialogContentText>
              Copy &amp; paste the content of a "kif" file or drag and drop it here.
            </DialogContentText>
            <TextField
              id="load-record-dialog-record"
              label="Content of Record File"
              placeholder="開始日時：..."
              multiline
              margin="normal"
              fullWidth
              autoFocus
              value={this.state.recordData}
              onChange={e => this.setState({ ...this.state, recordData: e.target.value })}
            />
          </Dropzone>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.props.onClose()}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.loadRecord()}>
            Load
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  setIsDropzoneActive(isActive: boolean) {
    this.setState({ ...this.state, isDropzoneActive: isActive });
  }

  loadFile(file: File) {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const buf = reader.result as ArrayBuffer;
      const data = new Uint8Array(buf);
      const encoding = som.formats.kif.detectEncoding(data);
      console.log({ file, encoding });
      const decoder = new TextDecoder(encoding);
      this.setState({ ...this.state, recordData: decoder.decode(data) });
      this.loadRecord();
    });
    reader.readAsArrayBuffer(file);
  }

  loadRecord() {
    const r = som.formats.kif.parseRecord(this.state.recordData);
    console.log(r);
    if (r instanceof Error) {
      return;
    }
    if (r.events.length === 0) {
      return;
    }
    const root = newRootGameNode();
    let leaf = root;
    for (const event of r.events) {
      const next = applyEvent(leaf, event);
      leaf.children.push(next);
      leaf = next;
      if (next.violations.length > 0) {
        break;
      }
    }
    console.log({
      root,
      leaf,
      r,
      a: som.formats.usi.stringifySFEN({ nextMoveNum: leaf.moveNum + 1, state: leaf.state }),
    });
    this.props.onClose({ record: r, rootGameNode: root });
  }
}

export default LoadRecordDialog;
