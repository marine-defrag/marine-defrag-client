import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';

import { ROUTES, FOOTER, API } from 'themes/config';

import messages from './messages';

const FooterMain = styled.div`
  background-color: ${palette('footer', 1)};
  color: ${palette('footer', 0)};
  padding: 0;
  @media print {
    color: ${palette('text', 0)};
    background: transparent;
  }
`;

const FooterLink = styled.a`
  font-weight:bold;
  color: ${palette('footerLinks', 0)};
  &:hover {
    color: ${palette('footerLinksHover', 0)};
  }
`;
const ImpactLink = styled.a`
  font-weight:bold;
  color: ${palette('footerLinks', 0)};
  &:hover {
    color: ${palette('footerLinksHover', 0)};
    opacity: 0.8;
  }
  @media print {
    color: ${palette('text', 0)};
    text-decoration: underline;
  }
`;

const ImpactLogo = styled(NormalImg)`
  height: 90px;
`;

const TableWrapper = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-left: -15px;
    margin-right: -15px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-left: -35px;
    margin-right: -35px;
  }
`;
const Table = styled.div`
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table;
    width: 100%;
    table-layout: fixed;
    font-size: 0.9em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const TableCell = styled.div`
  padding-top: 0.8em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid ${palette('footer', 3)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table-cell;
    vertical-align: top;
    width: 50%;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: none;
    border-right: 1px solid ${palette('footer', 3)};
    &:last-child {
      border-right: none;
    }
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-left: 35px;
    padding-right: 35px;
    padding-top: 1.6em;
    padding-bottom: 1.6em;
  }
`;
const TableCellSmall = styled(TableCell)`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 25%;
  }
`;

class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { intl } = this.context;
    const { theme } = this.props;
    return (
      <FooterMain>
        <Container noPaddingBottom>
          <TableWrapper>
            <Table>
              <TableCell>
                <FormattedMessage {...messages.disclaimer} />
                <FooterLink
                  target="_blank"
                  href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                  title={intl.formatMessage(messages.contact.anchor)}
                >
                  <FormattedMessage {...messages.contact.anchor} />
                </FooterLink>
              </TableCell>
              <TableCellSmall>
                { FOOTER.LINK_TARGET_INTERNAL
                  && (
                    <FormattedMessage
                      {...messages.responsible.textWithInternalLink}
                      values={{
                        internalLink: (
                          <FooterLink
                            onClick={(evt) => {
                              if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                              this.props.onPageLink(`${ROUTES.PAGES}/${FOOTER.LINK_TARGET_INTERNAL_ID}`);
                            }}
                            href={`${ROUTES.PAGES}/${FOOTER.LINK_TARGET_INTERNAL_ID}`}
                            title={intl.formatMessage(messages.responsible.anchor)}
                          >
                            <FormattedMessage {...messages.responsible.anchor} />
                          </FooterLink>
                        ),
                      }}
                    />
                  )
                }
                { !FOOTER.LINK_TARGET_INTERNAL
                  && <FormattedMessage {...messages.responsible.text} />
                }
                { !FOOTER.LINK_TARGET_INTERNAL
                  && (
                    <div>
                      <FooterLink
                        target="_blank"
                        href={intl.formatMessage(messages.responsible.url)}
                        title={intl.formatMessage(messages.responsible.anchor)}
                      >
                        <FormattedMessage {...messages.responsible.anchor} />
                      </FooterLink>
                    </div>
                  )
                }
              </TableCellSmall>
              <TableCellSmall>
                <FormattedMessage {...messages.project.text} />
                <div>
                  <ImpactLink
                    target="_blank"
                    href={intl.formatMessage(messages.project.url)}
                    title={intl.formatMessage(messages.project.anchor)}
                  >
                    <div>
                      <FormattedMessage {...messages.project.anchor} />
                    </div>
                    <ImpactLogo src={theme.media.impactossLogo} alt={intl.formatMessage(messages.project.anchor)} />
                  </ImpactLink>
                </div>
              </TableCellSmall>
            </Table>
          </TableWrapper>
        </Container>
      </FooterMain>
    );
  }
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  onPageLink: PropTypes.func.isRequired,
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
};

Footer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      loadEntitiesIfNeeded(API.PAGES);
      // kick off loading
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(null, mapDispatchToProps)(withTheme(Footer));
