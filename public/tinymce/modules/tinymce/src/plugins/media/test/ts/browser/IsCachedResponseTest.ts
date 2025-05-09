import { Assertions, UiFinder, Waiter } from '@ephox/agar';
import { describe, it } from '@ephox/bedrock-client';
import { SugarBody, SugarElement, TextContent } from '@ephox/sugar';
import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/wrap-mcagar';

import Editor from 'tinymce/core/api/Editor';
import Plugin from 'tinymce/plugins/media/Plugin';

import * as Utils from '../module/test/Utils';

describe('browser.tinymce.plugins.media.IsCachedResponseTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: [ 'media' ],
    toolbar: 'media',
    media_url_resolver: (data: { url: string }) => {
      return new Promise<{ html: string }>((resolve, reject) => {
        if (data.url === 'test') {
          resolve({
            html: '<div>x</div>'
          });
        } else {
          reject('error');
        }
      });
    },
    base_url: '/project/tinymce/js/tinymce'
  }, [ Plugin ], true);

  const pWaitForAndAssertNotification = async (expected: string) => {
    const notification = await UiFinder.pWaitFor('Could not find notification', SugarBody.body(), 'div.tox-notification__body') as SugarElement<HTMLElement>;
    const textContent = TextContent.get(notification);
    Assertions.assertEq('Plugin list html does not match', expected, textContent);
  };

  it('TBA: test cached response', async () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button[aria-label="Insert/edit media"]');
    await TinyUiActions.pWaitForDialog(editor);
    const input = await Utils.pSetSourceInput(editor, 'test');
    Utils.fakeEvent(input, 'paste');
    await Waiter.pWaitBetweenUserActions();
    await Utils.pAssertEmbedData(editor, '<div>x</div>');
    await Utils.pSetSourceInput(editor, 'XXX');
    TinyUiActions.submitDialog(editor);

    await pWaitForAndAssertNotification('Media embed handler threw unknown error.');
    TinyAssertions.assertContent(editor, '');
  });
});
