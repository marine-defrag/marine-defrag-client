/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled, { withTheme } from 'styled-components';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectActortypeTaxonomies,
  selectReady,
  selectActiveActortypes,
  selectActortypeQuery,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';

// components
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';

import { qe } from 'utils/quasi-equals';

// relative
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectActorCount,
  selectActionCount,
  selectActorDraftCount,
  selectActionDraftCount,
} from './selectors';

const Content = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 1em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 2em;
  }
`;
const Description = styled.p`
  margin-bottom: 1.5em;
  font-size: 1em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 2em;
    font-size: 1.1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const DiagramSvg = styled.svg``;
const DiagramSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @media print {
    display: none;
  }
`;

const PathLineCustom = styled(PathLine)`
  stroke: ${palette('dark', 2)};
  stroke-width: 0.5px;
  fill: none;
`;
const PathLineArrow = styled(PathLine)`
  fill: ${palette('dark', 2)};
`;

const STATE_INITIAL = {
  diagram: null,
  buttonActors_1: null,
  buttonActors_2: null,
  buttonActors_3: null,
  buttonActors_4: null,
  buttonActors_5: null,
  buttonActions: null,
};

export class Overview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = STATE_INITIAL;
  }

  // make sure to load all data from server
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getTaxonomiesByTagging = (taxonomies, tags) => taxonomies.filter((tax, key, list) => {
    if (tax.getIn(['attributes', tags])) {
      return true;
    }
    const childTaxonomies = list.filter((item) => qe(item.getIn(['attributes', 'parent_id']), tax.get('id')));
    return childTaxonomies.some((child) => child.getIn(['attributes', tags]));
  })

  getConnectionPoint = (node, nodeReference, side = 'bottom') => {
    const boundingRect = node.getBoundingClientRect();
    const boundingRectReference = nodeReference.getBoundingClientRect();

    if (side === 'right' || side === 'left') {
      return ({
        x: side === 'right'
          ? (boundingRect.right - boundingRectReference.left)
          : (boundingRect.left - boundingRectReference.left),
        y: (boundingRect.top - boundingRectReference.top)
          + (((boundingRect.bottom - boundingRectReference.top) - (boundingRect.top - boundingRectReference.top)) / 2),
      });
    }
    return ({
      x: (boundingRect.left - boundingRectReference.left)
        + (((boundingRect.right - boundingRectReference.left) - (boundingRect.left - boundingRectReference.left)) / 2),
      y: side === 'bottom'
        ? (boundingRect.bottom - boundingRectReference.top)
        : (boundingRect.top - boundingRectReference.top),
    });
  }

  getConnectionPath = (start, end) => [
    { x: start.x, y: start.y + 5 },
    { x: end.x, y: end.y - 5 },
  ];

  getCurvedConnectionPath = (direction = 'vertical', start, end, curve = 0.2) => {
    if (direction === 'right') {
      return [
        { x: start.x + 5, y: start.y },
        { x: Math.max(start.x, end.x) + 25, y: start.y },
        { x: Math.max(start.x, end.x) + 25, y: end.y },
        { x: end.x + 5, y: end.y },
      ];
    }
    return [
      { x: start.x, y: start.y + 5 },
      { x: start.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: end.y - 5 },
    ];
  }

  getConnectionPathArrow = (connectionPath, direction = 'bottom') => {
    const point = connectionPath[connectionPath.length - 1];
    if (direction === 'left') {
      return [
        point,
        { x: point.x + 5, y: point.y + 5 },
        { x: point.x + 5, y: point.y - 5 },
        point,
      ];
    }
    return [
      point,
      { x: point.x - 5, y: point.y - 5 },
      { x: point.x + 5, y: point.y - 5 },
      point,
    ];
  }

  connectActorsActions = (actortypeId) => this.getCurvedConnectionPath(
    'vertical',
    this.getConnectionPoint(this.state[`buttonActors_${actortypeId}`], this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonActions, this.state.diagram, 'top'),
    0.25,
  );

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  renderPathsSVG = (actortypes) => {
    const radius = 15;
    return (
      <DiagramSvgWrapper>
        {this.state.diagram && (
          <DiagramSvg
            width={this.state.diagram.getBoundingClientRect().width}
            height={this.state.diagram.getBoundingClientRect().height}
          >
            {actortypes && actortypes.valueSeq().map((actortype) => {
              const actortypeId = actortype.get('id');
              return this.state[`buttonActors_${actortypeId}`]
                && this.state.buttonActions
                && (
                  <PathLineCustom
                    key={actortypeId}
                    r={actortypes.size > 1 ? radius : 0}
                    points={this.connectActorsActions(actortypeId)}
                  />
                );
            })}
            {actortypes && actortypes.valueSeq().map((actortype) => {
              const actortypeId = actortype.get('id');
              return actortype.getIn(['attributes', 'has_actions'])
                && this.state[`buttonActors_${actortypeId}`]
                && this.state.buttonActions
                && (
                  <PathLineArrow
                    key={actortypeId}
                    r={0}
                    points={
                      this.getConnectionPathArrow(
                        this.connectActorsActions(actortypeId)
                      )
                    }
                  />
                );
            })}
          </DiagramSvg>
        )}
      </DiagramSvgWrapper>
    );
  }

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
      actortypes,
      actortypeId,
    } = this.props;

    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.supTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        {!dataReady && <EntityListSidebarLoading responsiveSmall />}
        {dataReady && (
          <TaxonomySidebar
            taxonomies={taxonomies}
            actortypeId={actortypeId}
            actortypes={actortypes}
            onTaxonomyLink={onTaxonomyLink}
          />
        )}
        <ContainerWithSidebar sidebarResponsiveSmall>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={intl.formatMessage(messages.supTitle)}
                title={intl.formatMessage(messages.title)}
              />
              <Description>
                <FormattedMessage {...messages.description} />
              </Description>
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}
// <AnnotationVertical>
//   {`${actorAddressedCount} ${intl.formatMessage(messages.diagram.addressed)}`}
// </AnnotationVertical>
// <AnnotationVertical>
//   <FormattedMessage {...messages.diagram.actiond} />
// </AnnotationVertical>

Overview.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  onTaxonomyLink: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  actorCountByActortype: PropTypes.object,
  actionCount: PropTypes.number,
  actorDraftCountByActortype: PropTypes.object,
  actionDraftCount: PropTypes.number,
  theme: PropTypes.object,
  actortypes: PropTypes.object,
  actortypeId: PropTypes.string,
};

Overview.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectActortypeTaxonomies(state),
  actortypes: selectActiveActortypes(state),
  actortypeId: selectActortypeQuery(state),
  actorCountByActortype: selectActorCount(state),
  actionCount: selectActionCount(state),
  actorDraftCountByActortype: selectActorDraftCount(state),
  actionDraftCount: selectActionDraftCount(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path, query) => {
      dispatch(updatePath(
        path,
        {
          query,
        }
      ));
    },
    onTaxonomyLink: (path) => {
      dispatch(updatePath(path, { keepQuery: true }));
    },
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Overview));
