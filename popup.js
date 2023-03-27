chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	$("#url").val(tabs[0].url);
	$("#title").val(tabs[0].title);
});