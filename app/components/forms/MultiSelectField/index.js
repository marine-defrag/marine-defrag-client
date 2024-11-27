import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { lowerCase } from 'utils/string';
import { getEntitySortComparator } from 'utils/sort';

import { fitComponent, SCROLL_PADDING } from 'utils/scroll-to-component';

import { omit } from 'lodash/object';
import Button from 'components/buttons/Button';
import A from 'components/styled/A';

import Icon from 'components/Icon';

import MultiSelectControl from '../MultiSelectControl';
import MultiSelectActiveOption from './MultiSelectActiveOption';
import messages from './messages';

const MultiSelectWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  max-height: 450px;
  min-height: 300px;
  height: ${(props) => props.wrapperHeight ? props.wrapperHeight : 450}px;
  width: 100%;
  overflow: hidden;
  display: block;
  z-index: 10;
  background-color: ${palette('background', 0)};
  border-left: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  border-color: ${palette('light', 2)};
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: 350px;
  }
`;
const MultiSelectFieldWrapper = styled.div`
  position: relative;
  padding: 10px 0;
`;
const MultiselectActiveOptions = styled.div`
  position: relative;
`;
const MultiselectActiveOptionList = styled.div`
  position: relative;
`;

const MultiSelectDropdownIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 8px 0 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding-right: 16px;
  }
`;
const MultiSelectDropdown = styled(Button)`
  position: relative;
  width: 100%;
  font-size: 0.85em;
  text-align: left;
  color: ${palette('multiSelectFieldButton', 0)};
  background-color: ${palette('multiSelectFieldButton', 1)};
  &:hover {
    color: ${palette('multiSelectFieldButtonHover', 0)};
    background-color: ${palette('multiSelectFieldButtonHover', 1)}
  }
  padding: 12px 0 12px 8px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 0.85em;
    padding: 12px 0 12px 16px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

const MultiSelectWithout = styled.div`
  color: ${palette('text', 1)};
  padding: 12px 0 12px 8px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding-left: 16px;
  }
`;
const MultiSelectWithoutLink = styled(A)`
  color: ${palette('text', 1)};
  &:hover {
    color: ${palette('link', 0)};
  }
`;

const NON_CONTROL_PROPS = ['hint', 'label', 'component', 'controlType', 'children', 'errorMessages'];

class MultiSelectField extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      multiselectOpen: null,
    };
    this.controlRef = React.createRef();
  }

  componentDidUpdate() {
    if (
      this.controlRef
      && this.controlRef.current
      && this.props.scrollContainer
    ) {
      fitComponent(this.controlRef.current, this.props.scrollContainer);
    }
  }

  // MULTISELECT
  onToggleMultiselect = (field) => {
    this.setState(
      (prevState) => ({
        multiselectOpen: prevState.multiselectOpen !== field.id
          ? field.id
          : null,
      })
    );
  }

  onCloseMultiselect = () => {
    this.setState({
      multiselectOpen: null,
    });
  }

  onMultiSelectItemRemove = (option) => this.props.handleUpdate && this.props.handleUpdate(
    this.props.fieldData.map((d) => option.get('value') === d.get('value')
      ? d.set('checked', false)
      : d)
  );

  onMultiSelectItemConnectionAttributeChange =
    ({ option, attribute, value }) => this.props.handleUpdate && this.props.handleUpdate(
      this.props.fieldData.map(
        (d) => {
          if (option.get('value') === d.get('value')) {
            if (d.get('association')) {
              return d.setIn(['association', attribute.attribute], value);
            }
            return d.set('association', Map({ [attribute.attribute]: value }));
          }
          return d;
        }
      )
    );

  getMultiSelectActiveOptions = (field, fieldData) => {
    // use form data if already loaded
    if (fieldData) {
      return this.sortOptions(
        fieldData.map(
          (option, index) => option.set('index', index)
        ).filter(
          (o) => o.get('checked')
        )
      );
    }
    // until then use initial options
    return this.sortOptions(
      field.options.map(
        (option, index) => option.set('index', index)
      ).filter(
        (o) => o.get('checked')
      )
    );
  }

  getOptionSortValueMapper = (option) => {
    if (option.get('order')) {
      return option.get('order');
    }
    return option.get('label');
  }

  sortOptions = (options) => options.sortBy(
    (option) => this.getOptionSortValueMapper(option),
    (a, b) => getEntitySortComparator(a, b, 'asc')
  )

  render() {
    const { field, fieldData } = this.props;
    const { intl } = this.context;
    const { id, model, ...controlProps } = omit(field, NON_CONTROL_PROPS);
    // console.log('field', field)
    // console.log('fieldData', fieldData && fieldData.toJS())
    const options = this.getMultiSelectActiveOptions(field, fieldData);
    // console.log('field options', options && options.toJS())
    return (
      <MultiSelectFieldWrapper>
        <MultiSelectDropdown
          onClick={(evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            this.onToggleMultiselect(field);
          }}
        >
          { field.label }
          <MultiSelectDropdownIcon>
            <Icon name={this.state.multiselectOpen === id ? 'dropdownClose' : 'dropdownOpen'} />
          </MultiSelectDropdownIcon>
        </MultiSelectDropdown>
        {this.state.multiselectOpen === id && (
          <MultiSelectWrapper
            ref={this.controlRef}
            wrapperHeight={(
              this.props.scrollContainer
              && this.props.scrollContainer.current
              && this.props.scrollContainer.current.getBoundingClientRect
            )
              ? this.props.scrollContainer.current.getBoundingClientRect().height - (SCROLL_PADDING * 2)
              : 450
            }
          >
            <MultiSelectControl
              id={id}
              model={model || `.${id}`}
              title={intl.formatMessage(messages.update, { type: lowerCase(field.label) })}
              onCancel={this.onCloseMultiselect}
              closeOnClickOutside={this.props.closeOnClickOutside}
              buttons={[
                field.onCreate
                  ? {
                    type: 'addFromMultiselect',
                    position: 'left',
                    onClick: field.onCreate,
                  }
                  : null,
                {
                  type: 'closeText',
                  onClick: this.onCloseMultiselect,
                },
              ]}
              {...controlProps}
            />
          </MultiSelectWrapper>
        )}
        <MultiselectActiveOptions>
          {options.size > 0 && (
            <MultiselectActiveOptionList>
              {options.map((option, i) => (
                <MultiSelectActiveOption
                  key={i}
                  option={option}
                  field={field}
                  onItemRemove={this.onMultiSelectItemRemove}
                  onConnectionAttributeChange={this.onMultiSelectItemConnectionAttributeChange}
                />
              ))}
            </MultiselectActiveOptionList>
          )}
          {options.size === 0 && (
            <MultiSelectWithout>
              <FormattedMessage
                {...messages.empty}
                values={{ entities: lowerCase(field.label) }}
              />
              <MultiSelectWithoutLink
                href="#add"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.onToggleMultiselect(field);
                }}
              >
                <FormattedMessage {...messages.emptyLink} />
              </MultiSelectWithoutLink>
            </MultiSelectWithout>
          )}
        </MultiselectActiveOptions>
      </MultiSelectFieldWrapper>
    );
  }
}

MultiSelectField.propTypes = {
  field: PropTypes.object,
  fieldData: PropTypes.object,
  handleUpdate: PropTypes.func,
  closeOnClickOutside: PropTypes.bool,
  scrollContainer: PropTypes.object,
};

MultiSelectField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default MultiSelectField;
