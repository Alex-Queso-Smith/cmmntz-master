import UserNewFormContainer from '../../app/javascript/react/containers/UserNewFormContainer';

describe('User New Form', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <UserNewFormContainer
      />
    )
  })

  it('should pass', () => {
    expect(true).toBe(true);
  });
});
