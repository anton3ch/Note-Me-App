import * as actions from './../../redux-store/actions';
import * as c from './../../redux-store/constants.js';

describe('Note Me actions', () => {

  it('switchMode should create TOGGLE_FORM action', () => {
    expect(actions.switchMode()).toEqual({
      type: c.THEME_CHANGE
    });
  });

});