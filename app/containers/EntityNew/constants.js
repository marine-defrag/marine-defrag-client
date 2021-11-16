
import { fromJS } from 'immutable';

export const FORM_INITIAL = fromJS({
  attributes: {
    draft: true,
    measuretype_id: '',
    actortype_id: '',
    taxonomy_id: '',
    manager_id: '',
    parent_id: '',
    title: '',
    code: '',
    description: '',
    comment: '',
    url: '',
    date_start: '',
    date_end: '',
    date_comment: '',
    target_comment: '',
    status_comment: '',
    activity_summary: '',
    short_title: '',
    gdp: '',
    population: '',
    amount: '',
    amount_comment: '',
    reference_ml: '',
    status_lbs_protocol: '',
    has_reference_landbased_ml: false,
  },
});
