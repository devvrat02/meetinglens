chrome.runtime.onInstalled.addListener(() => {
  console.log('MeetLens installed');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'check-meet-status') {
    sendResponse({ isMeet: true });
    return true;
  }

  if (message?.type === 'ping') {
    sendResponse({ ok: true });
    return true;
  }

  return false;
});
