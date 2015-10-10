import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('test-component', 'Integration | Component | test component', {
  integration: true
});

test('devTools saves the number of times that the component gets rendered', function(assert) {
  let devTools = this.container.lookup('service:ember-devtools');

  devTools.logRenders();

  this.render(hbs`{{test-component}}`);
  this.render(hbs`
    {{#test-component}}
      template block text
    {{/test-component}}
  `);

  assert.equal(devTools.get('renderedComponents.component:test-component.length'), 2);
});
