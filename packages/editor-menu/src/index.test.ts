import * as menu from './index';

describe('@flighthq/editor-menu exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(menu).sort()).toEqual([
      'addMenu',
      'addMenuItem',
      'createMenuBarState',
      'createMenuItem',
      'createSeparator',
      'createSubmenu',
      'getMenu',
      'getMenuBarVersion',
      'getMenuCount',
      'getMenuItem',
      'getMenuItems',
      'getMenus',
      'removeMenu',
      'removeMenuItem',
      'setMenuItemChecked',
      'setMenuItemEnabled',
    ]);
  });
});
