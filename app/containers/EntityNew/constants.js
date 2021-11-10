
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
    date_start: '',
    outcome: '',
    comment: '',
    date_comment: '',
    target_comment: '',
    status_comment: '',
    description: '',
    short_title: '',
    url: '',
    user_only: false,
    start_date: '',
    end_date: '',
  },
});
