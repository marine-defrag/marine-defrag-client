import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  Box, Text, Button, Drop,
} from 'grommet';
import { ACTORTYPES_CONFIG, ROUTES } from 'themes/config';
import appMessages from 'containers/App/messages';

const getActorLink = (actor) => `${ROUTES.ACTOR}/${actor.get('id')}`;

const getActorOnClick = (actor, onEntityClick) => (evt) => {
  if (evt) evt.preventDefault();
  onEntityClick(actor.get('id'), ROUTES.ACTOR);
};

export function CellBodyActors({
  entity,
  align = 'start',
  onEntityClick,
  intl,
}) {
  const buttonRef = useRef();
  const [showContent, setShowContent] = useState(false);
  return (
    <Box alignContent={align}>
      {entity.single && (
        <Button
          as="a"
          plain
          href={getActorLink(entity.single)}
          onClick={getActorOnClick(entity.single, onEntityClick)}
          title={entity.value}
          justify={align}
          style={{ textAlign: align === 'end' ? 'right' : 'left' }}
        >
          <Text
            size="small"
            wordBreak="keep-all"
            textAlign={align}
          >
            {entity.value}
          </Text>
        </Button>
      )}
      {entity.tooltip && (
        <Button
          ref={buttonRef}
          plain
          alignSelf={align}
          style={{ textAlign: align === 'end' ? 'right' : 'left' }}
          onClick={() => setShowContent(!showContent)}
        >
          <Text
            size="small"
            textAlign={align}
            wordBreak="keep-all"
            style={{ fontStyle: entity.multiple ? 'italic' : 'normal' }}
          >
            {entity.value}
          </Text>
        </Button>
      )}
      {entity.tooltip && showContent && buttonRef.current && (
        <Drop
          target={buttonRef.current}
          onClickOutside={() => setShowContent(false)}
          align={{
            bottom: 'top',
            right: 'right',
          }}
          plain
        >
          <Box pad="small" background="white" elevation="small" margin={{ horizontal: 'xsmall', vertical: 'small' }}>
            {Object.values(ACTORTYPES_CONFIG).sort(
              (a, b) => a.order < b.order ? -1 : 1
            ).map(
              (type) => {
                if (entity.tooltip.get(parseInt(type.id, 10))) {
                  const count = entity.tooltip.get(parseInt(type.id, 10)).size;
                  return (
                    <Box key={type.id}>
                      <Box border="bottom">
                        <Text weight={500}>
                          {`${count} ${intl.formatMessage(appMessages.entities[`actors_${type.id}`][count === 1 ? 'singleShort' : 'pluralShort'])}`}
                        </Text>
                      </Box>
                      <Box>
                        {entity.tooltip.get(parseInt(type.id, 10)).toList().map(
                          (actor) => (
                            <Button
                              key={actor.get('id')}
                              as="a"
                              plain
                              href={getActorLink(actor)}
                              onClick={getActorOnClick(actor, onEntityClick)}
                              title={actor.getIn(['attributes', 'title'])}
                            >
                              <Text
                                size="small"
                                wordBreak="keep-all"
                              >
                                {actor.getIn(['attributes', 'title'])}
                              </Text>
                            </Button>
                          )
                        )}
                      </Box>
                    </Box>
                  );
                }
                return null;
              }
            )}
          </Box>
        </Drop>
      )}
    </Box>
  );
}

CellBodyActors.propTypes = {
  entity: PropTypes.object,
  align: PropTypes.string,
  onEntityClick: PropTypes.func,
  intl: intlShape,
};


export default injectIntl(CellBodyActors);
