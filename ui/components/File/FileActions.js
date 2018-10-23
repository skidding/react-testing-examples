// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { GitRef } from '../../contexts';
import svgClippy from '../../svg/clippy.svg';
import svgLinkExternal from '../../svg/link-external.svg';
import { Button } from '../shared/styles';
import { parseCode } from './shared';

const { now } = Date;

type Props = {
  filePath: string,
  code: string
};

type CopyStatus = null | 'success' | 'error';

type State = {
  copyStatus: CopyStatus,
  copyTime: number
};

export class FileActions extends Component<Props, State> {
  clipboard: ?typeof Clipboard;

  state = {
    copyStatus: null,
    copyTime: 0
  };

  componentWillUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }

  handleCopyBtnRef = (node: ?HTMLElement) => {
    if (node) {
      const clipboard = new Clipboard(node);
      clipboard.on('success', this.handleCopySuccess);
      clipboard.on('error', this.handleCopyError);

      this.clipboard = clipboard;
    } else {
      this.clipboard = null;
    }
  };

  handleCopySuccess = () => {
    this.setState({
      copyStatus: 'success',
      copyTime: now()
    });
  };

  handleCopyError = () => {
    this.setState({
      copyStatus: 'error',
      copyTime: now()
    });
  };

  render() {
    const { filePath, code } = this.props;
    const { copyStatus, copyTime } = this.state;
    const { cleanCode } = parseCode(code);

    return (
      <GitRef.Consumer>
        {gitRef => (
          <Container>
            <CopyAction
              icon={svgClippy}
              title="Copy code"
              status={copyStatus}
              time={copyTime}
              ref={this.handleCopyBtnRef}
              data-clipboard-text={cleanCode}
            />
            <Action
              as="a"
              icon={svgLinkExternal}
              target="_blank"
              title="Open in GitHub"
              href={getFileUrl(gitRef, filePath)}
            />
          </Container>
        )}
      </GitRef.Consumer>
    );
  }
}

const PROJECT_ROOT_URL = 'https://github.com/skidding/react-testing-examples';

function getFileUrl(gitRef: string, filePath: string) {
  return `${PROJECT_ROOT_URL}/blob/${gitRef}/tests/${filePath}`;
}

const Container = styled.div`
  display: flex;
`;

const Action = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0 8px;
  background: url(${props => props.icon});
  background-size: 20px;
  background-position: center 6px;
  background-repeat: no-repeat;
  border-radius: 3px;
  opacity: 0.5;
  transition: opacity 0.3s;

  :hover {
    opacity: 0.9;
  }
`;

const CopyAction = styled(Action)`
  animation: flash${props => props.time} 3s;

  @keyframes flash${props => props.time} {
    from {
      background-color: ${props => getCopyBgColorByStatus(props.status)};
    }
    to {
      background-color: transparent;
    }
  }
`;

function getCopyBgColorByStatus(status: CopyStatus) {
  switch (status) {
    case 'success':
      return '#64e88d';
    case 'error':
      return '#f14342';
    default:
      return 'transparent';
  }
}
