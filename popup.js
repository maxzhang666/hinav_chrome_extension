chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	$("#url").val(tabs[0].url);
	$("#title").val(tabs[0].title);
	$("#icon").val(tabs[0].favIconUrl);
	$("#icon_view").attr('src',tabs[0].favIconUrl);
	console.log(tabs[0])
	// $("#description").val();
});
